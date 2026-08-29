"use client";

import { useEffect, useState } from "react";

export type Quality = "low" | "medium" | "high";

export type QualitySettings = {
  tier: Quality;
  /** Upper bound for the renderer's pixel ratio. */
  dpr: number;
  /** false turns the shadow pass off entirely. */
  shadows: boolean;
  /** Shadow map edge, in texels. Ignored when `shadows` is false. */
  shadowMap: number;
};

const SETTINGS: Record<Quality, Omit<QualitySettings, "tier">> = {
  // No shadow pass at all. That pass re-renders all thirty caps from the
  // light's point of view every frame, and it is the single most expensive
  // thing in the scene on a phone.
  low: { dpr: 1.5, shadows: false, shadowMap: 1024 },
  medium: { dpr: 1.75, shadows: true, shadowMap: 1024 },
  high: { dpr: 2, shadows: true, shadowMap: 2048 },
};

/**
 * Picks a quality tier from what the device actually reports rather than from
 * viewport width alone — a cheap phone held sideways is still a cheap phone,
 * and a 13" laptop is not.
 *
 * Everything here is a hint and any of it can be missing, so the checks are
 * ordered cheapest-signal-first and fall through to medium.
 */
export function useQuality(): QualitySettings {
  // Server and first paint get medium: it looks correct everywhere and avoids
  // a hydration mismatch on values that only exist in the browser.
  const [tier, setTier] = useState<Quality>("medium");

  useEffect(() => {
    const cores = navigator.hardwareConcurrency ?? 4;
    // Chromium only. Undefined elsewhere, so it can only ever downgrade.
    const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const narrow = window.matchMedia("(max-width: 767px)").matches;
    const saveData = (
      navigator as Navigator & { connection?: { saveData?: boolean } }
    ).connection?.saveData;

    let next: Quality;
    if (saveData || cores <= 4 || (memory !== undefined && memory <= 4)) {
      next = "low";
    } else if (coarse || narrow || cores <= 8) {
      next = "medium";
    } else {
      next = "high";
    }

    setTier(next);
  }, []);

  return { tier, ...SETTINGS[tier] };
}
