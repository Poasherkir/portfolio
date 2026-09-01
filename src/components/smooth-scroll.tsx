"use client";

import { useEffect, useState } from "react";
import { ReactLenis } from "lenis/react";
import type { ReactNode } from "react";

/**
 * Same tree either way — only the options change. Swapping the tree for
 * reduced motion is a hydration mismatch.
 *
 * `lerp` and `duration` are mutually exclusive in Lenis; passing both makes
 * the easing silently lose to the lerp.
 */
export default function SmoothScroll({ children }: { children: ReactNode }) {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  return (
    <ReactLenis
      root
      options={{
        lerp: reduced ? 1 : 0.13,
        smoothWheel: !reduced,
        // Touch already has native momentum; stacking Lenis on it fights back.
        syncTouch: false,
        wheelMultiplier: 1,
      }}
    >
      {children}
    </ReactLenis>
  );
}
