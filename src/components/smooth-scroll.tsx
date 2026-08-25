"use client";

import { ReactLenis } from "lenis/react";
import type { ReactNode } from "react";

/**
 * Lenis smooth scroll. Disabled outright for users who ask for reduced motion —
 * hijacking the scroll wheel is exactly what that setting is about.
 */
export default function SmoothScroll({ children }: { children: ReactNode }) {
  const prefersReduced =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReduced) return <>{children}</>;

  return (
    <ReactLenis root options={{ duration: 1.1, lerp: 0.09, smoothWheel: true }}>
      {children}
    </ReactLenis>
  );
}
