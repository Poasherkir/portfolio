"use client";

import { motion, type Variants } from "motion/react";
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
  return (
    <motion.div
      initial={{ filter: "blur(12px)", opacity: 0, y: 8 }}
      animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * Wipe reveal: the content slides up while a brand-coloured panel sweeps off it.
 * The site's signature entrance for headings.
 *
 * The panel is mounted on the client only. Rendering it server-side would ship
 * HTML in which a solid cyan rectangle sits on top of the heading — which is
 * what a visitor would be left staring at if the JS were slow or blocked.
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
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className={cn("relative overflow-hidden", className)} style={{ width }}>
      {/* The offset is a PERCENTAGE of the element's own height, never a fixed
          pixel value.
          
          This wrapper clips (`overflow-hidden`), and `whileInView` is driven by
          an IntersectionObserver that respects ancestor clipping. A fixed
          `y: 48` pushes a short element — an eyebrow is ~17px tall — entirely
          outside its own clip box, so the observer sees zero intersection, the
          animation never triggers, and the content stays hidden forever. Tall
          headings happened to survive; every small label did not.
          
          At 60% of its own height, 40% of the element always remains inside the
          box, which clears the 0.2 threshold at any size. */}
      <motion.div
        initial={{ opacity: 0, y: "60%" }}
        whileInView={{ opacity: 1, y: "0%" }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>

      {mounted && (
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
  const Comp = motion[as];
  return (
    <Comp
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-10%" }}
      variants={defaultVariants}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
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
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-8%" }}
      variants={{ visible: { transition: { staggerChildren: stagger } } }}
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
  return (
    <motion.div
      variants={defaultVariants}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
