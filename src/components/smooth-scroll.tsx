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
        // 0.13 took long enough to catch up that a flick felt like it was
        // being resisted. This still smooths the step between wheel notches
        // without the page lagging behind the hand.
        lerp: reduced ? 1 : 0.19,
        smoothWheel: !reduced,
        // Without this an in-page anchor is a native jump that teleports the
        // page and leaves Lenis to work out where it went.
        anchors: true,
        // Touch already has native momentum; stacking Lenis on it fights back.
        syncTouch: false,
        wheelMultiplier: 1,
      }}
    >
      {children}
    </ReactLenis>
  );
}
