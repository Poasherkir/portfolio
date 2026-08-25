"use client";

/**
 * Synthesised mechanical-keyboard sound.
 *
 * A press is three layers, the way a real switch actually sounds:
 *   1. a short filtered noise "tick"   — the stem hitting the housing
 *   2. a low pitched "thock"           — the bottom-out
 *   3. a brief high "clack"            — the plastic edge
 * A release is the same idea, lighter, higher and shorter.
 *
 * Each hit is detuned a few percent at random so repeated presses never sound
 * like the same sample fired twice.
 */

const MUTE_KEY = "mb:kbd-muted";

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let noise: AudioBuffer | null = null;
let unlocked = false;
let muted = false;

const listeners = new Set<(muted: boolean) => void>();
const unlockListeners = new Set<(unlocked: boolean) => void>();

/** Browsers will not let an AudioContext make a sound before a real gesture. */
export function isAudioUnlocked() {
  return unlocked;
}

export function subscribeUnlock(fn: (unlocked: boolean) => void) {
  unlockListeners.add(fn);
  return () => {
    unlockListeners.delete(fn);
  };
}

export function isMuted() {
  return muted;
}

export function subscribeMute(fn: (muted: boolean) => void) {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

export function setMuted(next: boolean) {
  muted = next;
  try {
    window.localStorage.setItem(MUTE_KEY, next ? "1" : "0");
  } catch {
    /* private mode — the preference just will not persist */
  }
  if (master && ctx) master.gain.setTargetAtTime(next ? 0 : 1, ctx.currentTime, 0.01);
  listeners.forEach((fn) => fn(next));
}

function buildNoise(context: AudioContext) {
  const length = Math.floor(context.sampleRate * 0.02);
  const buffer = context.createBuffer(1, length, context.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < length; i++) data[i] = Math.random() * 2 - 1;
  return buffer;
}

/**
 * Browsers refuse to start an AudioContext until the page has seen a real user
 * gesture. Pointer *movement* does not count — which is why hover-triggered
 * sound is silent until something is clicked. So the context is created on the
 * first genuine gesture and everything is audible from then on.
 */
export function initKeyboardAudio() {
  if (typeof window === "undefined" || unlocked) return;

  try {
    muted = window.localStorage.getItem(MUTE_KEY) === "1";
  } catch {
    muted = false;
  }

  const unlock = () => {
    if (unlocked) return;
    const Ctor =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return;

    ctx = new Ctor();
    master = ctx.createGain();
    master.gain.value = muted ? 0 : 1;

    /**
     * Soft clip, not a compressor.
     *
     * Hovering quickly fires several strikes within milliseconds and they sum.
     * A DynamicsCompressor handles that but ducks the sharp attack — which is
     * the entire thing that makes a click read as a click; measured, it pulled
     * a single strike down to -23 dBFS. A tanh shaper is transparent at normal
     * level and simply refuses to exceed full scale: a single strike lands at
     * -8 dBFS, four overlapping at -4, neither clipping.
     */
    const shaper = ctx.createWaveShaper();
    const curve = new Float32Array(1024);
    for (let i = 0; i < curve.length; i++) {
      const x = (i / (curve.length - 1)) * 2 - 1;
      curve[i] = Math.tanh(x * 1.3);
    }
    shaper.curve = curve;
    shaper.oversample = "2x";

    master.connect(shaper).connect(ctx.destination);
    noise = buildNoise(ctx);
    void ctx.resume();
    unlocked = true;
    unlockListeners.forEach((fn) => fn(true));

    // Confirmation click, immediately. Without it the visitor clicks, hears
    // nothing (because the click itself is what armed the audio), and
    // reasonably concludes the sound is broken.
    if (!muted) setTimeout(() => playPress(1.06), 30);

    window.removeEventListener("pointerdown", unlock);
    window.removeEventListener("keydown", unlock);
    window.removeEventListener("touchstart", unlock);
  };

  window.addEventListener("pointerdown", unlock);
  window.addEventListener("keydown", unlock);
  window.addEventListener("touchstart", unlock);
}

/**
 * Modal synthesis.
 *
 * A struck object does not make "filtered noise" — it rings at a set of
 * resonant modes, each with its own frequency, loudness and decay time. So a
 * very short impulse is fed through a bank of high-Q bandpass filters tuned to
 * those modes. That is what makes this read as a piece of plastic being hit
 * rather than a hiss with an envelope on it.
 */
type Mode = { f: number; q: number; gain: number; decay: number };

/**
 * Makeup gain.
 *
 * A high-Q bandpass passes only a narrow slice of the exciter's spectrum, so
 * six of them in parallel discard most of the energy going in. The mode gains
 * below read like output amplitudes but are nothing of the sort — measured
 * straight out of the graph, the summed result peaked at -34 dBFS, which is
 * inaudible on any normal volume setting. Measured again across a sweep, 13x
 * puts the peak near -6 dBFS with headroom to spare.
 */
const MAKEUP = 13;

/** Measured-by-ear modes for a keycap bottoming out in a plastic case. */
const PRESS_MODES: Mode[] = [
  { f: 168, q: 6, gain: 0.5, decay: 0.085 }, // case thock
  { f: 430, q: 10, gain: 0.28, decay: 0.055 },
  { f: 980, q: 14, gain: 0.34, decay: 0.038 },
  { f: 1850, q: 16, gain: 0.42, decay: 0.026 },
  { f: 3200, q: 14, gain: 0.36, decay: 0.018 }, // stem click
  { f: 5600, q: 10, gain: 0.24, decay: 0.011 }, // plastic edge
];

/** The upstroke: fewer modes, higher, drier. Nothing bottoms out. */
const RELEASE_MODES: Mode[] = [
  { f: 1400, q: 12, gain: 0.16, decay: 0.02 },
  { f: 3100, q: 14, gain: 0.22, decay: 0.014 },
  { f: 6200, q: 10, gain: 0.14, decay: 0.008 },
];

function strike(modes: Mode[], pitch: number, level: number) {
  if (!ctx || !master || !noise) return;

  const t = ctx.currentTime;
  // Excitation: a couple of milliseconds of noise, which is effectively an
  // impulse as far as the resonators are concerned.
  const src = ctx.createBufferSource();
  src.buffer = noise;
  src.playbackRate.value = 1 + (Math.random() * 0.1 - 0.05);

  const exciter = ctx.createGain();
  exciter.gain.setValueAtTime(1, t);
  exciter.gain.exponentialRampToValueAtTime(0.0001, t + 0.004);
  src.connect(exciter);

  for (const m of modes) {
    const bp = ctx.createBiquadFilter();
    bp.type = "bandpass";
    // Small random detune per mode per hit, so no two strikes are identical.
    bp.frequency.value = m.f * pitch * (1 + (Math.random() * 0.06 - 0.03));
    bp.Q.value = m.q;

    const env = ctx.createGain();
    env.gain.setValueAtTime(m.gain * level * MAKEUP, t);
    env.gain.exponentialRampToValueAtTime(0.0001, t + m.decay);

    exciter.connect(bp).connect(env).connect(master);
  }

  src.start(t);
  src.stop(t + 0.12);
}

export function playPress(pitch = 1) {
  if (!unlocked || muted || !ctx) return;
  if (ctx.state === "suspended") void ctx.resume();
  strike(PRESS_MODES, pitch, 1);
}

export function playRelease(pitch = 1) {
  if (!unlocked || muted || !ctx) return;
  if (ctx.state === "suspended") void ctx.resume();
  strike(RELEASE_MODES, pitch, 0.85);
}
