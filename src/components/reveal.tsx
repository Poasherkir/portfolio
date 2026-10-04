"use client";

import { motion, type Variants } from "motion/react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { useEffect, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Fade and rise in on load, for content above the fold. Plain CSS, so it runs
 * as soon as the page paints instead of waiting for JavaScript.
 */
export function FadeIn({
  children,
  className,
  delay = 0,
  duration = 0.9,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
}) {
  return (
    <div
      className={cn("animate-fade-in-up", className)}
      style={{ animationDelay: `${delay}s`, animationDuration: `${duration}s` }}
    >
      {children}
    </div>
  );
}

/**
 * Content slides up while a coloured panel sweeps off it. The panel is
 * client-only so it never covers the content if JS fails to load.
 */
export function WipeReveal({
  children,
  className,
  width = "fit-content",
  delay = 0,
  duration = 0.55,
}: {
  children: ReactNode;
  className?: string;
  width?: "fit-content" | "100%";
  delay?: number;
  duration?: number;
}) {
  const reduced = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className={cn("relative overflow-hidden", className)} style={{ width }}>
      {/* Offset in percent: a fixed pixel offset can push short content fully
          outside this clipping box, and then whileInView never fires. */}
      <motion.div
        initial={reduced ? { opacity: 1, y: "0%" } : { opacity: 0, y: "60%" }}
        whileInView={{ opacity: 1, y: "0%" }}
        viewport={{ once: true, amount: 0.2 }}
        transition={reduced ? INSTANT : { duration, delay, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>

      {mounted && !reduced && (
        <motion.div
          aria-hidden
          initial={{ left: "0%" }}
          whileInView={{ left: "101%" }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration, delay, ease: [0.65, 0, 0.35, 1] }}
          className="absolute inset-y-0 right-0 z-20 bg-brand"
        />
      )}
    </div>
  );
}

const defaultVariants: Variants = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0 },
};

// Motion animates from JS, so the reduced-motion CSS in globals.css does not
// reach it. These variants keep the same tree but remove the movement.
const staticVariants: Variants = {
  hidden: { opacity: 1, y: 0 },
  visible: { opacity: 1, y: 0 },
};

const INSTANT = { duration: 0 } as const;

/** Generic scroll-in wrapper. */
export function Reveal({
  children,
  className,
  delay = 0,
  duration = 0.55,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  as?: "div" | "li" | "section";
}) {
  const reduced = useReducedMotion();
  const Comp = motion[as];
  return (
    <Comp
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-10%" }}
      variants={reduced ? staticVariants : defaultVariants}
      transition={reduced ? INSTANT : { duration, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </Comp>
  );
}

/** Staggers children on scroll-in. Pair with <RevealItem>. */
export function RevealGroup({
  children,
  className,
  stagger = 0.07,
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-8%" }}
      variants={{ visible: { transition: { staggerChildren: reduced ? 0 : stagger } } }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function RevealItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      variants={reduced ? staticVariants : defaultVariants}
      transition={reduced ? INSTANT : { duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
