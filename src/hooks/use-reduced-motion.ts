"use client";

import { useEffect, useState } from "react";
import { useReducedMotion as usePrefersReducedMotion } from "motion/react";

/**
 * The reduced-motion preference, reported as false until after hydration so the
 * first client render matches the server HTML.
 */
export function useReducedMotion() {
  const prefers = usePrefersReducedMotion();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted && Boolean(prefers);
}
