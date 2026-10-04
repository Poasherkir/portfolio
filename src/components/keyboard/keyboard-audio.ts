"use client";

/**
 * Synthesised keyboard sounds (modal synthesis, no audio files). Each strike
 * is a noise burst through a bank of resonant bandpass filters, detuned a
 * little at random so repeated presses do not sound identical.
 */

const MUTE_KEY = "mb:kbd-muted";

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let noise: AudioBuffer | null = null;
let unlocked = false;
let muted = false;

const listeners = new Set<(muted: boolean) => void>();
const unlockListeners = new Set<(unlocked: boolean) => void>();

/** True once a user gesture has started the AudioContext. */
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
    /* storage unavailable; the preference is not persisted */
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

/** Creates the AudioContext on the first pointerdown, keydown or touchstart. */
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

    // tanh soft clip instead of a compressor, which would flatten the attack.
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

    // Audible feedback for the gesture that unlocked audio.
    if (!muted) setTimeout(() => playPress(1.06), 30);

    window.removeEventListener("pointerdown", unlock);
    window.removeEventListener("keydown", unlock);
    window.removeEventListener("touchstart", unlock);
  };

  window.addEventListener("pointerdown", unlock);
  window.addEventListener("keydown", unlock);
  window.addEventListener("touchstart", unlock);
}

/** One resonant mode: centre frequency, Q, level and decay time in seconds. */
type Mode = { f: number; q: number; gain: number; decay: number };

/** High-Q bandpasses discard most of the input energy; this brings the peak from about -34 to -6 dBFS. */
const MAKEUP = 13;

/** Keycap bottoming out in a plastic case. */
const PRESS_MODES: Mode[] = [
  { f: 168, q: 6, gain: 0.5, decay: 0.085 }, // case thock
  { f: 430, q: 10, gain: 0.28, decay: 0.055 },
  { f: 980, q: 14, gain: 0.34, decay: 0.038 },
  { f: 1850, q: 16, gain: 0.42, decay: 0.026 },
  { f: 3200, q: 14, gain: 0.36, decay: 0.018 }, // stem click
  { f: 5600, q: 10, gain: 0.24, decay: 0.011 }, // plastic edge
];

/** Key release: fewer, higher, shorter modes. */
const RELEASE_MODES: Mode[] = [
  { f: 1400, q: 12, gain: 0.16, decay: 0.02 },
  { f: 3100, q: 14, gain: 0.22, decay: 0.014 },
  { f: 6200, q: 10, gain: 0.14, decay: 0.008 },
];

function strike(modes: Mode[], pitch: number, level: number) {
  if (!ctx || !master || !noise) return;

  const t = ctx.currentTime;
  // A few milliseconds of noise acts as the impulse.
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
