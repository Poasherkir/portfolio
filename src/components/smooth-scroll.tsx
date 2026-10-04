"use client";

import { useEffect, useState } from "react";
import { ReactLenis } from "lenis/react";
import type { ReactNode } from "react";

/**
 * Lenis smooth scrolling. Reduced motion changes the options, not the tree.
 * Pass either `lerp` or `duration` to Lenis, never both.
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
        lerp: reduced ? 1 : 0.19,
        smoothWheel: !reduced,
        anchors: true,
        // Leave touch scrolling to the browser's native momentum.
        syncTouch: false,
        wheelMultiplier: 1,
      }}
    >
      {children}
    </ReactLenis>
  );
}
