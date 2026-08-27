"use client";

import { useCallback, useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * A soft light that follows the pointer across a group of cards.
 *
 * The position is written straight to a CSS custom property rather than to
 * React state — a mousemove handler that calls setState re-renders the whole
 * subtree on every pointer event, which is how this effect usually ends up
 * costing more than the rest of the page combined. Here it is one style write,
 * and the paint is done by the compositor.
 */
export default function Spotlight({
  children,
  className,
  size = 380,
}: {
  children: ReactNode;
  className?: string;
  /** Diameter of the light, in pixels. */
  size?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const frame = useRef(0);

  const onMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    // Coalesce to one write per frame; pointermove can fire far faster.
    if (frame.current) return;
    const { clientX, clientY } = e;
    frame.current = requestAnimationFrame(() => {
      frame.current = 0;
      const r = el.getBoundingClientRect();
      el.style.setProperty("--spot-x", `${clientX - r.left}px`);
      el.style.setProperty("--spot-y", `${clientY - r.top}px`);
    });
  }, []);

  const onLeave = useCallback(() => {
    ref.current?.style.setProperty("--spot-opacity", "0");
  }, []);

  const onEnter = useCallback(() => {
    ref.current?.style.setProperty("--spot-opacity", "1");
  }, []);

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      onPointerEnter={onEnter}
      onPointerLeave={onLeave}
      className={cn("group/spot relative", className)}
      style={
        {
          "--spot-x": "50%",
          "--spot-y": "50%",
          "--spot-opacity": "0",
          "--spot-size": `${size}px`,
        } as React.CSSProperties
      }
    >
      {/* Sits above the cards but below their content, so it lights the
          surfaces without washing out the type. Pointer-events off, or it
          would eat every hover it is meant to react to. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1] rounded-[inherit] transition-opacity duration-300"
        style={{
          opacity: "var(--spot-opacity)",
          background:
            "radial-gradient(var(--spot-size) circle at var(--spot-x) var(--spot-y), hsl(var(--brand) / 0.09), transparent 70%)",
        }}
      />
      {children}
    </div>
  );
}
