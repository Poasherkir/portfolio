"use client";

import { useEffect, useState } from "react";
import { ReactLenis } from "lenis/react";
import type { ReactNode } from "react";

/**
 * Lenis smooth scroll.
 *
 * The tree is the same either way and only the options change. Returning
 * `children` bare for reduced motion looked tidier but swapped the element
 * tree between server and client, which is a hydration mismatch.
 *
 * `lerp` and `duration` are mutually exclusive in Lenis — passing both means
 * the easing curve is quietly ignored in favour of the lerp. Only lerp is set
 * here, and at a value that keeps the page close to the wheel: below about
 * 0.1 the content visibly lags the input, which reads as sluggish rather than
 * smooth.
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
        // Touch devices already have native momentum; layering Lenis on top of
        // it is what makes phone scrolling feel like it is fighting back.
        syncTouch: false,
        wheelMultiplier: 1,
      }}
    >
      {children}
    </ReactLenis>
  );
}
