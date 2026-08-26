"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "motion/react";

/**
 * Counts a metric up when it scrolls into view.
 *
 * Values arrive as display strings ("~70", "343", "None"), so the digits are
 * pulled out and the prefix/suffix put back afterwards. Anything with no digits
 * in it is rendered as-is rather than animated.
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

  const [shown, setShown] = useState(0);

  useEffect(() => {
    if (!inView || target === null || reduced) return;

    let raf = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      // Ease out, so it decelerates onto the final value instead of stopping dead.
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

  const display = reduced || !inView ? target : shown;

  return (
    <span ref={ref} className={className}>
      {match?.[1]}
      {display.toLocaleString()}
      {match?.[3]}
    </span>
  );
}
