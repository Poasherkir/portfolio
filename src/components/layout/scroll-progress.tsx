"use client";

import { motion, useScroll, useSpring } from "motion/react";

/** Hairline read-out of how far down the page you are. */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });

  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[1100] h-px origin-left bg-brand"
    />
  );
}
