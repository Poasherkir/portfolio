"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";

/**
 * Deep-space backdrop: nebula clouds, three parallax star layers, vignette.
 *
 * Star positions are generated from a SEEDED generator at module scope and
 * rounded, not from Math.random(). Random values would differ between the
 * server render and the client render, and React reports that as a hydration
 * mismatch — the same class of bug that bit the project cover art earlier.
 *
 * This is also the complete fallback: if WebGL is unavailable or the visitor
 * asked for reduced motion, the 3D keyboard never mounts and this is the whole
 * design, so it has to stand on its own.
 */

/** Small deterministic PRNG (mulberry32) — same sequence everywhere, always. */
function seeded(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Star = { x: number; y: number; r: number; o: number; delay: number };

function field(count: number, seed: number, maxR: number): Star[] {
  const rand = seeded(seed);
  const stars: Star[] = [];
  for (let i = 0; i < count; i++) {
    stars.push({
      x: Math.round(rand() * 10000) / 100,
      y: Math.round(rand() * 10000) / 100,
      r: Math.round((0.25 + rand() * maxR) * 100) / 100,
      o: Math.round((0.25 + rand() * 0.75) * 100) / 100,
      delay: Math.round(rand() * 600) / 100,
    });
  }
  return stars;
}

// Three depths. Far stars are dense and dim, near stars sparse and bright.
//
// Counts are deliberately restrained. The page in front of this is now dense
// with copy, and a starfield that competes with body text stops being
// atmosphere and starts being noise — the backdrop's job is depth, not display.
const FAR = field(120, 12345, 0.45);
const MID = field(62, 67890, 0.8);
const NEAR = field(24, 24680, 1.3);

function Layer({ stars, twinkle }: { stars: Star[]; twinkle: boolean }) {
  return (
    <svg
      className="absolute inset-0 h-full w-full"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden
    >
      {stars.map((s, i) => (
        <circle
          key={i}
          cx={s.x}
          cy={s.y}
          r={s.r / 10}
          fill="#ffffff"
          opacity={s.o}
          style={
            twinkle
              ? { animation: `twinkle 4.5s ease-in-out ${s.delay}s infinite` }
              : undefined
          }
        />
      ))}
    </svg>
  );
}

export default function InstrumentBackground() {
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll();

  // Parallax: nearer layers travel further, which reads as depth.
  const farY = useTransform(scrollYProgress, [0, 1], ["0%", "6%"]);
  const midY = useTransform(scrollYProgress, [0, 1], ["0%", "14%"]);
  const nearY = useTransform(scrollYProgress, [0, 1], ["0%", "26%"]);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* Deep space ground. Light theme keeps a clean paper wash instead — a
          starfield on white reads as dirt, not as space. */}
      <div className="absolute inset-0 bg-[#f6f8fb] dark:bg-[#080808]" />
      <div
        className="absolute inset-0 hidden dark:block"
        style={{
          background:
            "radial-gradient(120% 90% at 70% 10%, #1a1010 0%, #0b0b0b 45%, #080808 100%)",
        }}
      />

      {/* Nebula clouds */}
      <div
        className="absolute -right-[18%] -top-[22%] h-[60rem] w-[60rem] rounded-full opacity-[0.10] blur-[130px] dark:opacity-[0.22]"
        style={{ background: "radial-gradient(circle, hsl(var(--brand)) 0%, transparent 62%)" }}
      />
      <div
        className="absolute -bottom-[28%] -left-[22%] h-[52rem] w-[52rem] rounded-full opacity-[0.08] blur-[130px] dark:opacity-[0.13]"
        style={{ background: "radial-gradient(circle, #7c5cff 0%, transparent 62%)" }}
      />
      <div
        className="absolute left-[35%] top-[38%] h-[34rem] w-[34rem] rounded-full opacity-[0.05] blur-[120px] dark:opacity-[0.18]"
        style={{ background: "radial-gradient(circle, #2ec5c1 0%, transparent 62%)" }}
      />

      {/* Stars — dark theme only, and held well under the content. */}
      <div className="absolute inset-0 hidden opacity-[0.55] dark:block">
        <motion.div className="absolute inset-0" style={reduced ? undefined : { y: farY }}>
          <Layer stars={FAR} twinkle={!reduced} />
        </motion.div>
        <motion.div className="absolute inset-0" style={reduced ? undefined : { y: midY }}>
          <Layer stars={MID} twinkle={!reduced} />
        </motion.div>
        <motion.div className="absolute inset-0" style={reduced ? undefined : { y: nearY }}>
          <Layer stars={NEAR} twinkle={false} />
        </motion.div>
      </div>

      {/* Vignette, so copy always wins over the artwork behind it. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(130% 85% at 25% 30%, transparent 0%, hsl(var(--background) / 0.55) 65%, hsl(var(--background) / 0.9) 100%)",
        }}
      />
    </div>
  );
}
