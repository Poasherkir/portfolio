"use client";

import { useCallback, useRef, type ReactNode } from "react";
import { useReducedMotion } from "motion/react";

/**
 * Pulls its child slightly toward the pointer. Transform is written straight
 * to the node, so this never re-renders React.
 */
export default function Magnetic({
  children,
  strength = 0.22,
  className,
}: {
  children: ReactNode;
  /** Fraction of the cursor's offset from centre that the element follows. */
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const frame = useRef(0);
  const reduced = useReducedMotion();

  const onMove = useCallback(
    (e: React.PointerEvent<HTMLSpanElement>) => {
      const el = ref.current;
      if (!el || reduced) return;
      // No hover on coarse pointers — it would only fire as a jump on tap.
      if (e.pointerType !== "mouse") return;
      if (frame.current) return;

      const { clientX, clientY } = e;
      frame.current = requestAnimationFrame(() => {
        frame.current = 0;
        const r = el.getBoundingClientRect();
        const dx = (clientX - (r.left + r.width / 2)) * strength;
        const dy = (clientY - (r.top + r.height / 2)) * strength;
        // rAF already updates every frame; a transition on top of it lags.
        el.style.transition = "none";
        el.style.transform = `translate3d(${dx.toFixed(2)}px, ${dy.toFixed(2)}px, 0)`;
      });
    },
    [strength, reduced]
  );

  const onLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    // Ease the return only.
    el.style.transition = "transform 420ms cubic-bezier(0.22, 1, 0.36, 1)";
    el.style.transform = "translate3d(0, 0, 0)";
  }, []);

  return (
    <span
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className={className}
      style={{ display: "inline-block" }}
    >
      {children}
    </span>
  );
}
