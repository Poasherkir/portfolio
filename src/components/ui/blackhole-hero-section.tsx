"use client";

import * as React from "react";
import { useEffect, useRef } from "react";

/**
 * Raymarched Schwarzschild black hole.
 *
 * Every pixel traces one ray backwards through curved space until it crosses
 * the horizon, escapes, or hits the gas disc — possibly several times, since a
 * ray can loop the hole. The halo and the thin ring by the shadow are the same
 * disc re-imaged through bent light, not separate layers.
 *
 * Units: r = 1 is the horizon, photon sphere 1.5, disc starts at 3 (ISCO).
 */

export interface BlackHoleHeroSectionProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Camera distance from the hole, in horizon radii. */
  distance?: number;
  /**
   * Camera height above the disc, in degrees. Near 0 the disc is edge-on and
   * the far side arches over the shadow. Past ~25 that halo folds away.
   */
  elevation?: number;
  /** Where the camera sits around the hole, in degrees. */
  azimuth?: number;
  /** Degrees the camera swings around the hole per second. 0 keeps it still. */
  orbitSpeed?: number;
  /** Turns the picture about the line of sight, in degrees, so the disc runs on a diagonal. */
  roll?: number;
  /** Vertical field of view, in degrees. */
  fov?: number;
  /** Inner edge of the disc, in horizon radii. 3 is the innermost stable orbit; below it gas falls in. */
  diskInner?: number;
  /** Outer edge of the disc. */
  diskOuter?: number;
  /** Half-thickness of the disc at its inner edge. It flares outward from there. */
  diskThickness?: number;
  /** How much gas there is. Above 1 the near side starts to hide the far side. */
  diskDensity?: number;
  /** Overall brightness of the gas before tone mapping. */
  brightness?: number;
  /** Turns of the inner rim per second. The rest follows Kepler, so it lags. */
  spinSpeed?: number;
  /** Size of the turbulence in the gas. Higher is finer. */
  grain?: number;
  /**
   * Relativistic beaming, 0 to 1. Gas at the rim runs at 0.4c, so the
   * approaching side brightens and blues. Flux goes as g³; this scales the
   * exponent.
   */
  doppler?: number;
  /** Brightest gas, at the inner rim. */
  hotColor?: string;
  /** Mid-disc. */
  midColor?: string;
  /** Coolest gas, at the outer edge. */
  coolColor?: string;
  /** Background stars, 0 to 2. Lensed too, so they smear into arcs near the rim. */
  starBrightness?: number;
  /** Bloom, 0 to 2. */
  glow?: number;
  /** Exposure into the tone curve. */
  exposure?: number;
  /** Corner darkening, 0 to 1. */
  vignette?: number;
  /** Steps per ray — the main cost. 300 is clean, 180 for phones, 140 bands. */
  steps?: number;
  /** Render scale, 0.5 to 1. Drop it before you drop `steps`. */
  resolution?: number;
  /** Cap on device pixel ratio. */
  maxDpr?: number;
  /** Hole position in frame, fractions of width/height from top left. */
  focus?: [number, number];
  /** Lays a veil over one edge so text can sit there and still be read. */
  scrim?: "none" | "left" | "right" | "top" | "bottom";
  /** How dark that edge gets, 0 to 1. */
  scrimStrength?: number;
  /** Freeze on the current frame. */
  paused?: boolean;
  children?: React.ReactNode;
}

/* -------------------------------------------------------------------------- */
/*  Shaders                                                                   */
/* -------------------------------------------------------------------------- */

const VERT = `
attribute vec2 aPos;
varying vec2 vUv;
void main() {
  vUv = aPos * 0.5 + 0.5;
  gl_Position = vec4(aPos, 0.0, 1.0);
}
`;

/**
 * Scene pass. One ray per pixel through Schwarzschild space.
 *
 * Photon paths obey u'' + u = 3M·u² with u = 1/r; in Cartesian form
 *   a = -3/2 · h² · r/|r|⁵ ,  h = |r × v| , constant,  horizon at |r| = 1.
 */
const SCENE_FRAG = `
precision highp float;

#define MAX_STEPS 460

/** Seconds before the wound-up gas pattern crossfades to a fresh copy. */
#define WIND_CYCLE 46.0

varying vec2 vUv;

uniform vec2  uRes;
uniform float uTime;
uniform vec3  uCamPos;
uniform vec3  uRight;
uniform vec3  uUp;
uniform vec3  uFwd;
uniform float uTanHalf;
uniform vec2  uFocus;
uniform float uSteps;
uniform float uSkyR;
uniform float uDiskIn;
uniform float uDiskOut;
uniform float uThick;
uniform float uDensity;
uniform float uSpin;
uniform float uGrain;
uniform float uBright;
uniform float uDoppler;
uniform vec3  uHot;
uniform vec3  uMid;
uniform vec3  uCool;
uniform float uStars;
uniform float uEncode;
uniform vec2  uJitter;
uniform float uSeed;

/* --- noise ---------------------------------------------------------------- */

float hash13(vec3 p) {
  p = fract(p * 0.3183099 + vec3(0.1, 0.2, 0.3));
  p *= 17.0;
  return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
}

float vnoise(vec3 x) {
  vec3 i = floor(x);
  vec3 f = fract(x);
  f = f * f * (3.0 - 2.0 * f);
  float n000 = hash13(i + vec3(0.0, 0.0, 0.0));
  float n100 = hash13(i + vec3(1.0, 0.0, 0.0));
  float n010 = hash13(i + vec3(0.0, 1.0, 0.0));
  float n110 = hash13(i + vec3(1.0, 1.0, 0.0));
  float n001 = hash13(i + vec3(0.0, 0.0, 1.0));
  float n101 = hash13(i + vec3(1.0, 0.0, 1.0));
  float n011 = hash13(i + vec3(0.0, 1.0, 1.0));
  float n111 = hash13(i + vec3(1.0, 1.0, 1.0));
  return mix(
    mix(mix(n000, n100, f.x), mix(n010, n110, f.x), f.y),
    mix(mix(n001, n101, f.x), mix(n011, n111, f.x), f.y),
    f.z
  );
}

/** lod fades the finest octave out, for rays whose steps are too long to see it. */
float fbm(vec3 p, float lod) {
  float a = 0.5;
  float s = 0.0;
  for (int i = 0; i < 4; i++) {
    s += (i == 3 ? a * lod : a) * vnoise(p);
    p = p * 2.03 + vec3(11.3, 7.1, 3.7);
    a *= 0.5;
  }
  return s;
}

/* --- the gas -------------------------------------------------------------- */

/**
 * Density and colour of the disc at a point. Kepler orbits mean each radius
 * turns at its own rate; reading turbulence in that rotating frame shears the
 * clouds into trailing spirals.
 */
void gasAt(vec3 p, float rd, float dt, out float dens, out vec3 tint, out float heat) {
  float rn = clamp((rd - uDiskIn) / max(0.001, uDiskOut - uDiskIn), 0.0, 1.0);

  // A thin sheet at the rim, flaring outward.
  float tk = uThick * (0.35 + 1.25 * rn);
  float v = p.y / tk;
  float sheet = exp(-v * v);

  // The finest octave is finer than a typical step, so sampled once each those
  // cells beat rather than average and the arms come out combed. Fade it out
  // as the step grows.
  float lod = clamp(1.0 - dt * uGrain * 14.0, 0.0, 1.0);

  float phi = atan(p.z, p.x);
  // Kepler: omega goes as r^-3/2, so every radius turns at its own rate and
  // the clouds are read in a frame that turns with them. That shear is what
  // draws the trailing spirals — nothing here draws a spiral.
  float omega = uSpin * pow(uDiskIn / rd, 1.5);
  // A third axis, so two radii turning at their own rates do not read the same
  // cloud, plus a slow creep inward so the gas falls as well as turns.
  float lr = log(rd) * 1.1 + uSpin * uTime * 0.05;

  // Unchecked, the shear winds forever and the spiral tightens past a pixel
  // into moire. Two copies run half a cycle apart and crossfade, so nothing
  // winds past one cycle and each handover lands where its layer is weightless.
  float u = uTime / WIND_CYCLE;
  float fA = fract(u);
  float fB = fract(u + 0.5);
  float w = abs(2.0 * fA - 1.0);

  float cloudsA = fbm(vec3(vec2(cos(phi + omega * fA * WIND_CYCLE),
                                sin(phi + omega * fA * WIND_CYCLE)) * (rd * uGrain), lr), lod);
  float cloudsB = fbm(vec3(vec2(cos(phi + omega * fB * WIND_CYCLE),
                                sin(phi + omega * fB * WIND_CYCLE)) * (rd * uGrain), lr + 40.0), lod);
  float clouds = mix(cloudsA, cloudsB, w);

  // Squared for the density only, so the gaps between the filaments go
  // properly dark instead of filling in as haze. The temperature below keeps
  // reading the smooth version: heat should not have hard edges.
  float filaments = clouds * clouds * 1.75;

  // Bright at the rim, gone by the outer edge, gone again just inside it.
  float inner = smoothstep(0.0, 0.07, rn);
  float outer = 1.0 - smoothstep(0.45, 1.0, rn);
  float prof = inner * outer * pow(uDiskIn / rd, 2.0);

  dens = max(0.0, filaments * 1.5 - 0.30) * sheet * prof * uDensity * 4.6;

  // Shakura–Sunyaev: T falls as r^-3/4. The colour ramp rides it.
  heat = pow(uDiskIn / rd, 0.8) * (0.72 + 0.55 * clouds);
  tint = mix(uCool, uMid, smoothstep(0.10, 0.52, heat));
  tint = mix(tint, uHot, smoothstep(0.52, 1.05, heat));
}

/* --- stars ---------------------------------------------------------------- */

/**
 * Stars on the six faces of a cube, read through whichever face the ray exits.
 * Kept near a pixel wide: this sky is already lensed, and a wider blob smears
 * into long arcs instead of staying a point that merely brightens.
 */
vec3 starField(vec3 d) {
  vec3 a = abs(d);
  vec2 uv;
  float face;
  if (a.x >= a.y && a.x >= a.z)      { uv = d.yz / a.x; face = d.x > 0.0 ? 0.0 : 1.0; }
  else if (a.y >= a.z)               { uv = d.xz / a.y; face = d.y > 0.0 ? 2.0 : 3.0; }
  else                               { uv = d.xy / a.z; face = d.z > 0.0 ? 4.0 : 5.0; }

  vec3 col = vec3(0.0);
  for (int k = 0; k < 3; k++) {
    float sc = 90.0 * pow(2.2, float(k));
    vec2 p = uv * sc;
    vec2 id = floor(p);
    vec2 f = fract(p) - 0.5;
    float h = hash13(vec3(id, face * 19.0));
    if (h > 0.965) {
      vec2 off = vec2(hash13(vec3(id, face + 11.0)), hash13(vec3(id, face + 23.0)));
      float dd = length(f - (off - 0.5) * 0.7);
      float s = smoothstep(0.055, 0.0, dd);
      float warm = hash13(vec3(id, face + 51.0));
      col += s * (0.6 + 4.5 * fract(h * 97.0))
           * mix(vec3(0.72, 0.82, 1.0), vec3(1.0, 0.88, 0.72), warm)
           / pow(2.2, float(k));
    }
  }
  // A breath of dust, so the sky is not flat black between the points.
  col += vec3(0.013, 0.017, 0.030) * fbm(d * 2.6, 1.0);
  return col;
}

/* --- march ---------------------------------------------------------------- */

void main() {
  // Sub-pixel jitter, averaged across frames. At the shadow's rim a hair of
  // aim lands on very different disc, so one sample per pixel is not enough.
  vec2 uv = (gl_FragCoord.xy + uJitter - uFocus * uRes) / uRes.y;
  vec3 dir = normalize(uFwd + (uv.x * uRight + uv.y * uUp) * 2.0 * uTanHalf);

  vec3 pos = uCamPos;
  vec3 vel = dir;

  // Angular momentum. Conserved, so it is read once and carried.
  vec3 hv = cross(pos, vel);
  float h2 = dot(hv, hv);
  float h = sqrt(h2);
  /** Angle swept around the hole so far. dphi/ds = h/r², and h is constant. */
  float swept = 0.0;

  vec3 col = vec3(0.0);
  float transmit = 1.0;
  bool captured = false;

  // Where in its step each ray reads the gas. Always reading the middle beats
  // the step pattern into rings, and a fixed per-pixel offset rides the way
  // steps shorten near the disc — so walk it on by the golden ratio each step.
  float jitter = fract(sin(dot(gl_FragCoord.xy + uSeed, vec2(12.9898, 78.233))) * 43758.5453);

  for (int i = 0; i < MAX_STEPS; i++) {
    if (float(i) >= uSteps) break;

    float r2 = dot(pos, pos);
    float r = sqrt(r2);

    if (r < 1.0) { captured = true; break; }          // through the horizon
    if (r > uSkyR && dot(pos, vel) > 0.0) break;      // gone, and not coming back
    if (transmit < 0.004) break;                      // nothing behind this is visible

    float dt = clamp(0.14 * (r - 1.0), 0.025, 1.1);

    // Never step more than half the way to the disc plane while the disc is
    // still in radial reach, or a grazing ray tunnels clean through it.
    if (r < uDiskOut * 1.25) {
      float rn = clamp((r - uDiskIn) / max(0.001, uDiskOut - uDiskIn), 0.0, 1.0);
      float tk = uThick * (0.35 + 1.25 * rn);
      dt = min(dt, max(tk * 0.38, abs(pos.y) * 0.5));
    }

    swept += h * dt / r2;

    // Each extra wrap of the hole paints a tighter copy of the disc and costs
    // about e^2pi in brightness. At full weight they pile into a hairline ring
    // one ray per pixel cannot resolve, which sparkles. Half a turn is free,
    // which leaves the halo alone.
    float deep = exp(-1.3 * max(0.0, swept - 4.6));

    jitter = fract(jitter + 0.6180339887);
    vec3 mid = pos + vel * (dt * jitter);
    float rd = length(mid.xz);

    if (rd > uDiskIn && rd < uDiskOut && abs(mid.y) < uThick * 5.0) {
      float dens;
      float heat;
      vec3 tint;
      gasAt(mid, rd, dt, dens, tint, heat);

      if (dens > 0.001) {
        // Beaming. The gas orbits at sqrt(M/r) with M = 1/2, so 0.41c at the
        // rim. g folds in the boost and the climb out of the well; flux goes
        // as g³, and uDoppler dials that exponent down to nothing.
        vec3 tang = normalize(cross(vec3(0.0, 1.0, 0.0), vec3(mid.x, 0.0, mid.z)));
        float beta = min(0.85, sqrt(0.5 / max(rd, 1.5)));
        float gam = inversesqrt(max(1e-4, 1.0 - beta * beta));
        vec3 toObs = -normalize(vel);
        float g = 1.0 / (gam * (1.0 - beta * dot(tang, toObs)));
        g *= sqrt(max(0.05, 1.0 - 1.0 / rd));
        float boost = pow(max(g, 0.02), 3.0 * uDoppler);

        // Coming at you it also runs blue, going away it runs red.
        vec3 shift = mix(
          vec3(1.0),
          g > 1.0 ? vec3(0.86, 0.94, 1.14) : vec3(1.15, 0.82, 0.62),
          clamp(abs(g - 1.0) * 1.6, 0.0, 1.0) * uDoppler
        );

        float emit = uBright * (0.26 + 2.0 * heat * heat);
        col += tint * shift * (emit * boost * dens * transmit * dt * deep);
        transmit *= exp(-dens * 0.30 * dt);
      }
    }

    // u'' + u = 3M u², in Cartesian form.
    vec3 acc = -1.5 * h2 * pos / (r2 * r2 * r);
    vel += acc * dt;
    pos += vel * dt;
  }

  if (!captured && uStars > 0.001) {
    // A magnified point stays as bright rather than becoming a bright streak,
    // so divide by the stretch — the ratio of leaving to arriving angle off the
    // line to the hole. Long arcs then fade as they lengthen.
    vec3 toHole = normalize(-uCamPos);
    float sI = length(cross(normalize(dir), toHole));
    float sS = length(cross(normalize(vel), toHole));
    float stretch = clamp(sI / max(1e-3, sS), 1.0, 40.0);
    col += starField(normalize(vel)) * uStars * transmit / stretch;
  }

  if (uEncode > 0.5) col = col / (1.0 + col);
  gl_FragColor = vec4(col, 1.0);
}
`;

/**
 * Folds the new frame into the running average. The camera is static so there
 * is nothing to reproject; `uAlpha` trades noise against smearing on the gas.
 */
const BLEND_FRAG = `
precision highp float;
varying vec2 vUv;
uniform sampler2D uCur;
uniform sampler2D uPrev;
uniform float uAlpha;

void main() {
  vec3 c = texture2D(uCur, vUv).rgb;
  vec3 p = texture2D(uPrev, vUv).rgb;
  gl_FragColor = vec4(mix(p, c, uAlpha), 1.0);
}
`;

/** Pulls out what is brighter than the threshold, at a quarter of the size. */
const BRIGHT_FRAG = `
precision highp float;
varying vec2 vUv;
uniform sampler2D uTex;
uniform vec2 uTexel;
uniform float uDecode;
uniform float uPack;
uniform float uThreshold;

void main() {
  vec3 s = texture2D(uTex, vUv + uTexel * vec2(-1.0, -1.0)).rgb
         + texture2D(uTex, vUv + uTexel * vec2( 1.0, -1.0)).rgb
         + texture2D(uTex, vUv + uTexel * vec2(-1.0,  1.0)).rgb
         + texture2D(uTex, vUv + uTexel * vec2( 1.0,  1.0)).rgb;
  s *= 0.25;
  if (uDecode > 0.5) s = s / max(vec3(0.002), 1.0 - s);
  float l = max(s.r, max(s.g, s.b));
  s *= max(0.0, l - uThreshold) / max(0.0001, l);
  gl_FragColor = vec4(s * uPack, 1.0);
}
`;

/** Five taps, weights from a gaussian, offsets picked so the sampler pairs them. */
const BLUR_FRAG = `
precision highp float;
varying vec2 vUv;
uniform sampler2D uTex;
uniform vec2 uStep;

void main() {
  vec3 s = texture2D(uTex, vUv).rgb * 0.2270270;
  s += (texture2D(uTex, vUv + uStep * 1.3846154).rgb
      + texture2D(uTex, vUv - uStep * 1.3846154).rgb) * 0.3162162;
  s += (texture2D(uTex, vUv + uStep * 3.2307692).rgb
      + texture2D(uTex, vUv - uStep * 3.2307692).rgb) * 0.0702702;
  gl_FragColor = vec4(s, 1.0);
}
`;

const COMPOSITE_FRAG = `
precision highp float;
varying vec2 vUv;
uniform sampler2D uScene;
uniform sampler2D uBloom;
uniform vec2  uRes;
uniform float uDecode;
uniform float uPack;
uniform float uGlow;
uniform float uExposure;
uniform float uVignette;
uniform float uScrimDir;
uniform float uScrimAmt;
uniform float uSeed;

vec3 aces(vec3 x) {
  return clamp((x * (2.51 * x + 0.03)) / (x * (2.43 * x + 0.59) + 0.14), 0.0, 1.0);
}

void main() {
  vec3 scene = texture2D(uScene, vUv).rgb;
  if (uDecode > 0.5) scene = scene / max(vec3(0.002), 1.0 - scene);
  vec3 bloom = texture2D(uBloom, vUv).rgb / uPack;

  vec3 c = scene + bloom * uGlow;
  c = aces(c * uExposure);
  c = pow(max(c, 0.0), vec3(0.4545));

  // Corners down.
  vec2 d = vUv - 0.5;
  c *= 1.0 - uVignette * dot(d, d) * 1.9;

  // The edge the copy sits on: heavy at the edge, off quickly, so the middle
  // of the frame keeps its contrast instead of going grey.
  if (uScrimDir > 0.5) {
    float x = uScrimDir < 1.5 ? vUv.x
            : uScrimDir < 2.5 ? 1.0 - vUv.x
            : uScrimDir < 3.5 ? 1.0 - vUv.y
            : vUv.y;
    c *= 1.0 - uScrimAmt * pow(1.0 - clamp(x, 0.0, 1.0), 2.4);
  }

  // A grain of dither. Without it these long dark ramps band into rings.
  float n = fract(sin(dot(gl_FragCoord.xy + uSeed, vec2(12.9898, 78.233))) * 43758.5453);
  c += (n - 0.5) / 255.0;

  gl_FragColor = vec4(c, 1.0);
}
`;

/* -------------------------------------------------------------------------- */
/*  Small helpers                                                             */
/* -------------------------------------------------------------------------- */

const RAD = Math.PI / 180;

/** Hex to linear light. The shader works in linear and gamma-encodes at the end. */
function hexToLinear(hex: string): [number, number, number] {
  const h = hex.trim().replace("#", "");
  const full =
    h.length === 3 ? h[0] + h[0] + h[1] + h[1] + h[2] + h[2] : h.slice(0, 6);
  const n = parseInt(full, 16);
  const srgb = [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
  return srgb.map((v) =>
    v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
  ) as [number, number, number];
}

type Prog = {
  program: WebGLProgram;
  u: Record<string, WebGLUniformLocation | null>;
};

type Target = {
  fb: WebGLFramebuffer;
  tex: WebGLTexture;
  w: number;
  h: number;
};

/* -------------------------------------------------------------------------- */
/*  Component                                                                 */
/* -------------------------------------------------------------------------- */

export function BlackHoleHeroSection({
  distance = 24,
  elevation = -5.5,
  azimuth = 0,
  orbitSpeed = 0,
  roll = -20,
  fov = 42,
  diskInner = 3,
  diskOuter = 15,
  diskThickness = 0.26,
  diskDensity = 1,
  brightness = 1,
  spinSpeed = 0.06,
  grain = 0.48,
  doppler = 0.35,
  hotColor = "#FFF3DE",
  midColor = "#FF9838",
  coolColor = "#8E3A0B",
  starBrightness = 0,
  glow = 1,
  exposure = 0.9,
  vignette = 0.28,
  steps = 300,
  resolution = 0.7,
  maxDpr = 1.75,
  focus = [0.72, 0.46],
  scrim = "none",
  scrimStrength = 0.9,
  paused = false,
  className = "",
  children,
  ...rest
}: BlackHoleHeroSectionProps) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const props = useRef({
    distance, elevation, azimuth, orbitSpeed, roll, fov, diskInner, diskOuter,
    diskThickness, diskDensity, brightness, spinSpeed, grain, doppler, hotColor,
    midColor, coolColor, starBrightness, glow, exposure, vignette, steps,
    resolution, maxDpr, focus, scrim, scrimStrength, paused,
  });
  props.current = {
    distance, elevation, azimuth, orbitSpeed, roll, fov, diskInner, diskOuter,
    diskThickness, diskDensity, brightness, spinSpeed, grain, doppler, hotColor,
    midColor, coolColor, starBrightness, glow, exposure, vignette, steps,
    resolution, maxDpr, focus, scrim, scrimStrength, paused,
  };

  useEffect(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;
    if (!host || !canvas) return;

    const reduced =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const opts: WebGLContextAttributes = {
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: "high-performance",
      preserveDrawingBuffer: false,
    };
    const gl = (canvas.getContext("webgl2", opts) ||
      canvas.getContext("webgl", opts)) as
      | WebGL2RenderingContext
      | WebGLRenderingContext
      | null;

    /** Hide the canvas — a dead one paints white over the background. */
    function giveUp(why: string) {
      host!.dataset.webgl = why;
      canvas!.style.display = "none";
    }

    if (!gl) {
      giveUp("unsupported");
      return;
    }

    // Software renderers run this at seconds per frame and the browser kills
    // the context for hanging, so detect one and drop to a cheap setting.
    const dbg = gl.getExtension("WEBGL_debug_renderer_info");
    const renderer = dbg
      ? String(gl.getParameter((dbg as WEBGL_debug_renderer_info).UNMASKED_RENDERER_WEBGL) || "")
      : "";
    const software = /swiftshader|llvmpipe|softpipe|software|microsoft basic/i.test(renderer);
    const isGL2 = typeof WebGL2RenderingContext !== "undefined" &&
      gl instanceof WebGL2RenderingContext;

    /* --- shader plumbing -------------------------------------------------- */

    function compile(type: number, src: string): WebGLShader | null {
      const sh = gl!.createShader(type);
      if (!sh) return null;
      gl!.shaderSource(sh, src);
      gl!.compileShader(sh);
      if (!gl!.getShaderParameter(sh, gl!.COMPILE_STATUS)) {
        // Short: when a context dies every shader fails at once with no log.
        console.error("blackhole: shader failed —", gl!.getShaderInfoLog(sh) || "no log (context lost?)");
        gl!.deleteShader(sh);
        return null;
      }
      return sh;
    }

    function link(fragSrc: string): Prog | null {
      const vs = compile(gl!.VERTEX_SHADER, VERT);
      const fs = compile(gl!.FRAGMENT_SHADER, fragSrc);
      if (!vs || !fs) return null;
      const program = gl!.createProgram();
      if (!program) return null;
      gl!.attachShader(program, vs);
      gl!.attachShader(program, fs);
      gl!.bindAttribLocation(program, 0, "aPos");
      gl!.linkProgram(program);
      gl!.deleteShader(vs);
      gl!.deleteShader(fs);
      if (!gl!.getProgramParameter(program, gl!.LINK_STATUS)) {
        console.error(gl!.getProgramInfoLog(program));
        return null;
      }
      const u: Record<string, WebGLUniformLocation | null> = {};
      const n = gl!.getProgramParameter(program, gl!.ACTIVE_UNIFORMS) as number;
      for (let i = 0; i < n; i++) {
        const info = gl!.getActiveUniform(program, i);
        if (info) u[info.name] = gl!.getUniformLocation(program, info.name);
      }
      return { program, u };
    }

    /* --- render targets --------------------------------------------------- */

    // Half floats keep the gas bright enough to bloom properly. Where they are
    // missing the scene is packed with Reinhard into 8 bits instead and
    // unpacked on the way out — coarser, but it holds the highlights.
    let hdr = true;
    let texType: number = gl.UNSIGNED_BYTE;
    let internal: number = gl.RGBA;
    if (isGL2) {
      const g2 = gl as WebGL2RenderingContext;
      const ok =
        g2.getExtension("EXT_color_buffer_half_float") ||
        g2.getExtension("EXT_color_buffer_float");
      if (ok) {
        texType = g2.HALF_FLOAT;
        internal = g2.RGBA16F;
      } else hdr = false;
    } else {
      const hf = gl.getExtension("OES_texture_half_float");
      const cb = gl.getExtension("EXT_color_buffer_half_float");
      if (hf && cb) texType = (hf as OES_texture_half_float).HALF_FLOAT_OES;
      else hdr = false;
    }
    if (!hdr) {
      texType = gl.UNSIGNED_BYTE;
      internal = gl.RGBA;
    }
    const linearOK =
      isGL2 ||
      !!gl.getExtension("OES_texture_half_float_linear") ||
      !hdr;
    const filter = linearOK ? gl.LINEAR : gl.NEAREST;
    /** Bloom is scaled down before it goes into 8 bits, and scaled back after. */
    const pack = hdr ? 1 : 0.12;

    function makeTarget(w: number, h: number): Target | null {
      const tex = gl!.createTexture();
      const fb = gl!.createFramebuffer();
      if (!tex || !fb) return null;
      gl!.bindTexture(gl!.TEXTURE_2D, tex);
      gl!.texImage2D(gl!.TEXTURE_2D, 0, internal, w, h, 0, gl!.RGBA, texType, null);
      gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_MIN_FILTER, filter);
      gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_MAG_FILTER, filter);
      gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_WRAP_S, gl!.CLAMP_TO_EDGE);
      gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_WRAP_T, gl!.CLAMP_TO_EDGE);
      gl!.bindFramebuffer(gl!.FRAMEBUFFER, fb);
      gl!.framebufferTexture2D(
        gl!.FRAMEBUFFER, gl!.COLOR_ATTACHMENT0, gl!.TEXTURE_2D, tex, 0
      );
      const status = gl!.checkFramebufferStatus(gl!.FRAMEBUFFER);
      gl!.bindFramebuffer(gl!.FRAMEBUFFER, null);
      if (status !== gl!.FRAMEBUFFER_COMPLETE) {
        gl!.deleteTexture(tex);
        gl!.deleteFramebuffer(fb);
        return null;
      }
      return { fb, tex, w, h };
    }

    /* --- resources -------------------------------------------------------- */

    let sceneProg: Prog | null = null;
    let blendProg: Prog | null = null;
    let brightProg: Prog | null = null;
    let blurProg: Prog | null = null;
    let compProg: Prog | null = null;
    let vbo: WebGLBuffer | null = null;
    let scene: Target | null = null;
    let histA: Target | null = null;
    let histB: Target | null = null;
    let bloomA: Target | null = null;
    let bloomB: Target | null = null;
    /** Frames folded into the running average since it was last thrown away. */
    let settled = 0;

    let width = 0;
    let height = 0;
    let sceneW = 0;
    let sceneH = 0;

    function build(): boolean {
      sceneProg = link(SCENE_FRAG);
      blendProg = link(BLEND_FRAG);
      brightProg = link(BRIGHT_FRAG);
      blurProg = link(BLUR_FRAG);
      compProg = link(COMPOSITE_FRAG);
      if (!sceneProg || !blendProg || !brightProg || !blurProg || !compProg) return false;

      // One triangle, big enough to cover the frame. Cheaper than two, and no
      // seam down the diagonal.
      vbo = gl!.createBuffer();
      gl!.bindBuffer(gl!.ARRAY_BUFFER, vbo);
      gl!.bufferData(
        gl!.ARRAY_BUFFER,
        new Float32Array([-1, -1, 3, -1, -1, 3]),
        gl!.STATIC_DRAW
      );
      gl!.enableVertexAttribArray(0);
      gl!.vertexAttribPointer(0, 2, gl!.FLOAT, false, 0, 0);
      gl!.disable(gl!.DEPTH_TEST);
      gl!.disable(gl!.BLEND);
      return true;
    }

    function dropTargets() {
      for (const t of [scene, histA, histB, bloomA, bloomB]) {
        if (!t) continue;
        gl!.deleteTexture(t.tex);
        gl!.deleteFramebuffer(t.fb);
      }
      scene = null;
      histA = null;
      histB = null;
      bloomA = null;
      bloomB = null;
      settled = 0;
    }

    function resize() {
      const rect = host!.getBoundingClientRect();
      const dpr = software
        ? 1
        : Math.min(window.devicePixelRatio || 1, Math.max(1, props.current.maxDpr));
      const cssW = Math.max(1, Math.round(rect.width));
      const cssH = Math.max(1, Math.round(rect.height));
      const scale = software
        ? 0.34
        : Math.min(1, Math.max(0.4, props.current.resolution));
      const w = Math.max(2, Math.round(cssW * dpr));
      const h = Math.max(2, Math.round(cssH * dpr));
      const sw = Math.max(2, Math.round(w * scale));
      const sh = Math.max(2, Math.round(h * scale));
      if (w === width && h === height && sw === sceneW && sh === sceneH) return;
      width = w;
      height = h;
      sceneW = sw;
      sceneH = sh;
      canvas!.width = w;
      canvas!.height = h;
      canvas!.style.width = cssW + "px";
      canvas!.style.height = cssH + "px";
      dropTargets();
      scene = makeTarget(sw, sh);
      histA = makeTarget(sw, sh);
      histB = makeTarget(sw, sh);
      const bw = Math.max(2, sw >> 2);
      const bh = Math.max(2, sh >> 2);
      bloomA = makeTarget(bw, bh);
      bloomB = makeTarget(bw, bh);
    }

    /* --- draw ------------------------------------------------------------- */

    /** Simulation clock, in seconds. Advances only while the thing is running. */
    let clock = reduced ? 6 : 0;
    let lastFrame = 0;
    let running = true;
    let visible = true;
    let raf = 0;

    function pass(prog: Prog, target: Target | null) {
      gl!.useProgram(prog.program);
      gl!.bindFramebuffer(gl!.FRAMEBUFFER, target ? target.fb : null);
      gl!.viewport(0, 0, target ? target.w : width, target ? target.h : height);
    }

    function draw() {
      gl!.drawArrays(gl!.TRIANGLES, 0, 3);
    }

    function bind(tex: WebGLTexture, unit: number) {
      gl!.activeTexture(gl!.TEXTURE0 + unit);
      gl!.bindTexture(gl!.TEXTURE_2D, tex);
    }

    /** Eight sub-pixel aim points from Halton 2,3 — spreads better than random. */
    const HALTON: Array<[number, number]> = [
      [0.5, 0.333], [0.25, 0.667], [0.75, 0.111], [0.125, 0.444],
      [0.625, 0.778], [0.375, 0.222], [0.875, 0.556], [0.0625, 0.889],
    ];

    function render(t: number) {
      if (!sceneProg || !blendProg || !brightProg || !blurProg || !compProg) return;
      if (!scene || !histA || !histB || !bloomA || !bloomB) return;
      const C = props.current;

      // Camera: an orbit about the hole, at a fixed height above the disc.
      const az = (C.azimuth + C.orbitSpeed * t) * RAD;
      const el = Math.max(-88, Math.min(88, C.elevation)) * RAD;
      const dist = Math.max(2.2, C.distance);
      const ce = Math.cos(el);
      const camX = dist * ce * Math.cos(az);
      const camY = dist * Math.sin(el);
      const camZ = dist * ce * Math.sin(az);

      // Look at the hole. Then roll about the line of sight, which changes
      // nothing in space and only decides how the disc lies across the frame.
      const fx = -camX / dist, fy = -camY / dist, fz = -camZ / dist;
      let rx = fz, ry = 0, rz = -fx;          // cross(fwd, worldUp), worldUp = +y
      const rl = Math.hypot(rx, ry, rz) || 1;
      rx /= rl; ry /= rl; rz /= rl;
      const ux = ry * fz - rz * fy;
      const uy = rz * fx - rx * fz;
      const uz = rx * fy - ry * fx;
      const cr = Math.cos(C.roll * RAD);
      const sr = Math.sin(C.roll * RAD);
      const RX = rx * cr + ux * sr, RY = ry * cr + uy * sr, RZ = rz * cr + uz * sr;
      const UX = -rx * sr + ux * cr, UY = -ry * sr + uy * cr, UZ = -rz * sr + uz * cr;

      const hot = hexToLinear(C.hotColor);
      const mid = hexToLinear(C.midColor);
      const cool = hexToLinear(C.coolColor);
      const outer = Math.max(C.diskInner + 0.5, C.diskOuter);

      /* scene ------------------------------------------------------------- */
      pass(sceneProg, scene);
      const u = sceneProg.u;
      gl!.uniform2f(u.uRes!, scene.w, scene.h);
      gl!.uniform1f(u.uTime!, t);
      gl!.uniform3f(u.uCamPos!, camX, camY, camZ);
      gl!.uniform3f(u.uRight!, RX, RY, RZ);
      gl!.uniform3f(u.uUp!, UX, UY, UZ);
      gl!.uniform3f(u.uFwd!, fx, fy, fz);
      gl!.uniform1f(u.uTanHalf!, Math.tan(Math.max(8, Math.min(110, C.fov)) * 0.5 * RAD));
      // gl_FragCoord counts up from the bottom; the prop reads from the top.
      gl!.uniform2f(u.uFocus!, C.focus[0], 1 - C.focus[1]);
      gl!.uniform1f(
        u.uSteps!,
        software ? 130 : Math.max(60, Math.min(460, Math.round(C.steps)))
      );
      gl!.uniform1f(u.uSkyR!, Math.max(dist * 1.35, outer * 2.4));
      gl!.uniform1f(u.uDiskIn!, Math.max(1.05, C.diskInner));
      gl!.uniform1f(u.uDiskOut!, outer);
      gl!.uniform1f(u.uThick!, Math.max(0.02, C.diskThickness));
      gl!.uniform1f(u.uDensity!, Math.max(0, C.diskDensity));
      gl!.uniform1f(u.uSpin!, C.spinSpeed * 6.2831853);
      gl!.uniform1f(u.uGrain!, Math.max(0.02, C.grain));
      gl!.uniform1f(u.uBright!, Math.max(0, C.brightness));
      gl!.uniform1f(u.uDoppler!, Math.max(0, Math.min(1, C.doppler)));
      gl!.uniform3f(u.uHot!, hot[0], hot[1], hot[2]);
      gl!.uniform3f(u.uMid!, mid[0], mid[1], mid[2]);
      gl!.uniform3f(u.uCool!, cool[0], cool[1], cool[2]);
      gl!.uniform1f(u.uStars!, Math.max(0, C.starBrightness));
      gl!.uniform1f(u.uEncode!, hdr ? 0 : 1);
      const h = HALTON[settled % HALTON.length];
      gl!.uniform2f(u.uJitter!, h[0] - 0.5, h[1] - 0.5);
      gl!.uniform1f(u.uSeed!, (settled % 64) * 17.13);
      draw();

      /* fold into the running average ------------------------------------- */
      // Enough history to bury the noise without the gas dragging a tail.
      const alpha = settled === 0 ? 1 : 0.14;
      pass(blendProg, histB);
      bind(scene.tex, 0);
      bind(histA.tex, 1);
      gl!.uniform1i(blendProg.u.uCur!, 0);
      gl!.uniform1i(blendProg.u.uPrev!, 1);
      gl!.uniform1f(blendProg.u.uAlpha!, alpha);
      draw();
      const shown = histB;
      const tmp = histA;
      histA = histB;
      histB = tmp;
      settled++;

      /* bright pass ------------------------------------------------------- */
      pass(brightProg, bloomA);
      bind(shown.tex, 0);
      gl!.uniform1i(brightProg.u.uTex!, 0);
      gl!.uniform2f(brightProg.u.uTexel!, 1 / shown.w, 1 / shown.h);
      gl!.uniform1f(brightProg.u.uDecode!, hdr ? 0 : 1);
      gl!.uniform1f(brightProg.u.uPack!, pack);
      gl!.uniform1f(brightProg.u.uThreshold!, 0.85);
      draw();

      /* two rounds of blur, the second wider ------------------------------ */
      const blurStep = (src: Target, dst: Target, dx: number, dy: number) => {
        pass(blurProg!, dst);
        bind(src.tex, 0);
        gl!.uniform1i(blurProg!.u.uTex!, 0);
        gl!.uniform2f(blurProg!.u.uStep!, dx / dst.w, dy / dst.h);
        draw();
      };
      blurStep(bloomA, bloomB, 1, 0);
      blurStep(bloomB, bloomA, 0, 1);
      blurStep(bloomA, bloomB, 2.6, 0);
      blurStep(bloomB, bloomA, 0, 2.6);

      /* composite --------------------------------------------------------- */
      pass(compProg, null);
      bind(shown.tex, 0);
      bind(bloomA.tex, 1);
      gl!.uniform1i(compProg.u.uScene!, 0);
      gl!.uniform1i(compProg.u.uBloom!, 1);
      gl!.uniform2f(compProg.u.uRes!, width, height);
      gl!.uniform1f(compProg.u.uDecode!, hdr ? 0 : 1);
      gl!.uniform1f(compProg.u.uPack!, pack);
      gl!.uniform1f(compProg.u.uGlow!, Math.max(0, C.glow) * 0.26);
      gl!.uniform1f(compProg.u.uExposure!, Math.max(0.05, C.exposure));
      gl!.uniform1f(compProg.u.uVignette!, Math.max(0, Math.min(1, C.vignette)));
      gl!.uniform1f(
        compProg.u.uScrimDir!,
        C.scrim === "left" ? 1 : C.scrim === "right" ? 2 : C.scrim === "top" ? 3 : C.scrim === "bottom" ? 4 : 0
      );
      gl!.uniform1f(compProg.u.uScrimAmt!, Math.max(0, Math.min(1, C.scrimStrength)));
      gl!.uniform1f(compProg.u.uSeed!, (t * 60) % 1000);
      draw();
    }

/** Draws one settled still, taking all the averaging passes at once. */
    function settle(passes: number) {
      for (let i = 0; i < passes; i++) render(clock);
    }

    /* --- loop ------------------------------------------------------------- */

    function tick(now: number) {
      if (!running) return;
      raf = requestAnimationFrame(tick);
      if (!visible) { lastFrame = now; return; }
      const dt = lastFrame ? Math.min(0.05, (now - lastFrame) / 1000) : 0;
      lastFrame = now;
      if (!props.current.paused && !reduced) clock += dt;
      render(clock);
    }

    if (!build()) {
      giveUp("build-failed");
      return;
    }
    resize();
    settle(reduced ? 16 : 1);
    if (!reduced) raf = requestAnimationFrame(tick);

    /* --- the world ------------------------------------------------------- */

    const ro = new ResizeObserver(() => {
      resize();
      if (reduced || props.current.paused) settle(16);
    });
    ro.observe(host);

    const io = new IntersectionObserver(
      (entries) => { visible = entries[0]?.isIntersecting ?? true; },
      { threshold: 0 }
    );
    io.observe(host);

    const onVisibility = () => { visible = !document.hidden; lastFrame = 0; };
    const onLost = (e: Event) => {
      // Hide until the context is actually back — a dead one paints white.
      e.preventDefault();
      running = false;
      cancelAnimationFrame(raf);
      canvas.style.display = "none";
    };
    const onRestored = () => {
      width = height = sceneW = sceneH = 0;
      if (!build()) {
        giveUp("lost");
        return;
      }
      canvas.style.display = "";
      host.dataset.webgl = "";
      resize();
      running = true;
      lastFrame = 0;
      settle(reduced ? 16 : 1);
      if (!reduced) raf = requestAnimationFrame(tick);
    };

    document.addEventListener("visibilitychange", onVisibility);
    canvas.addEventListener("webglcontextlost", onLost);
    canvas.addEventListener("webglcontextrestored", onRestored);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      canvas.removeEventListener("webglcontextlost", onLost);
      canvas.removeEventListener("webglcontextrestored", onRestored);
      dropTargets();
      if (vbo) gl.deleteBuffer(vbo);
      for (const p of [sceneProg, blendProg, brightProg, blurProg, compProg]) {
        if (p) gl.deleteProgram(p.program);
      }
      // The context is left alive on purpose. WEBGL_lose_context here breaks
      // StrictMode's setup/cleanup/setup: the second setup gets the same dead
      // context and every shader fails with an empty log.
    };
  }, []);

  return (
    <div
      ref={hostRef}
      className={`relative isolate h-full w-full overflow-hidden bg-black ${className}`}
      {...rest}
    >
      <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 h-full w-full" />
      {children ? <div className="relative z-10 h-full w-full">{children}</div> : null}
    </div>
  );
}

export default BlackHoleHeroSection;
