"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import { useEffect, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Blur-and-fade in on mount. Used for the hero, which has no scroll trigger. */
export function BlurIn({
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
  const reduced = useReducedMotion();

  return (
    <motion.div
      initial={
        reduced
          ? { filter: "blur(0px)", opacity: 1, y: 0 }
          : { filter: "blur(12px)", opacity: 0, y: 8 }
      }
      animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
      transition={reduced ? INSTANT : { duration, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * Content slides up while a coloured panel sweeps off it. The panel mounts on
 * the client only — server-rendered, it would cover the heading if JS stalled.
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
      {/* Percentage, never a fixed pixel offset. This wrapper clips, and
          whileInView's IntersectionObserver respects that clipping — a fixed
          y:48 pushes anything shorter than 48px fully outside its own clip
          box, so it never intersects and never reveals. */}
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

/**
 * Reduced motion has to be handled here, in JS.
 *
 * The blanket rule in globals.css collapses animation-duration and
 * transition-duration, which covers anything driven by CSS. None of this is:
 * Motion writes transform, opacity and filter as inline styles from its own
 * frame loop, and a CSS duration has no bearing on that. So a visitor who had
 * asked for less motion still got every blur, slide and wipe on the site,
 * because these wrappers are on nearly every element of it.
 *
 * Still the same element and the same props either way — swapping the tree on
 * a media query is a hydration mismatch.
 */
const staticVariants: Variants = {
  hidden: { opacity: 1, y: 0 },
  visible: { opacity: 1, y: 0 },
};

/** No travel, and short enough to read as "already there". */
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
