"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "motion/react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

/**
 * Counts a metric up when scrolled into view. Works on display strings like
 * "~70"; values without digits render unchanged.
 */
export default function CountUp({
  value,
  className,
  duration = 1100,
}: {
  value: string;
  className?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduced = useReducedMotion();

  const match = value.match(/^(\D*)(\d[\d\s,]*)(.*)$/s);
  const target = match ? Number.parseInt(match[2].replace(/[\s,]/g, ""), 10) : null;

  // null until the animation starts, so the final value is never preceded by a flash of 0.
  const [shown, setShown] = useState<number | null>(null);

  useEffect(() => {
    if (!inView || target === null || reduced) return;

    let raf = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      setShown(Math.round(target * (1 - Math.pow(1 - t, 3))));
      if (t < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, target, reduced, duration]);

  if (target === null) {
    return (
      <span ref={ref} className={className}>
        {value}
      </span>
    );
  }

  const display = shown ?? target;

  return (
    <span ref={ref} className={className}>
      {match?.[1]}
      {display.toLocaleString()}
      {match?.[3]}
    </span>
  );
}
