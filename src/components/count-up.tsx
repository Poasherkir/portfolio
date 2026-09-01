"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "motion/react";

/**
 * Counts a metric up on scroll-in. Values arrive as display strings ("~70",
 * "None"), so digits are extracted and the prefix/suffix restored. Anything
 * with no digits renders as-is.
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

  // null until the animation starts. Initialising to 0 rendered the metric
  // as 0 for a frame, which reads as a broken number.
  const [shown, setShown] = useState<number | null>(null);

  useEffect(() => {
    if (!inView || target === null || reduced) return;

    let raf = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      // Ease out onto the final value.
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
