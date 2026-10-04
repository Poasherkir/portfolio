"use client";

import { AnimatePresence, motion } from "motion/react";
import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { profile } from "@/data/portfolio";

type PreloaderState = {
  isLoading: boolean;
  percent: number;
  /** Ends the intro; called by the 3D scene once it has loaded. */
  bypassLoading: () => void;
};

const PreloaderContext = createContext<PreloaderState>({
  isLoading: false,
  percent: 100,
  bypassLoading: () => {},
});
export const usePreloader = () => useContext(PreloaderContext);

const DURATION_MS = 1400;
const SESSION_KEY = "mb:seen-intro";

/** Intro counter, shown once per browser session. */
export default function Preloader({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [percent, setPercent] = useState(0);
  const raf = useRef<number>(0);

  useEffect(() => {
    const seen =
      typeof window !== "undefined" && window.sessionStorage.getItem(SESSION_KEY) === "1";
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Skip it in background tabs, where rAF is suspended and the overlay would never lift.
    const hidden = document.visibilityState === "hidden";

    if (seen || reduced || hidden) {
      window.sessionStorage.setItem(SESSION_KEY, "1");
      setPercent(100);
      setIsLoading(false);
      return;
    }

    const finish = () => {
      window.sessionStorage.setItem(SESSION_KEY, "1");
      setPercent(100);
      setIsLoading(false);
    };

    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / DURATION_MS, 1);
      // easeOutExpo
      const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
      setPercent(Math.round(eased * 100));
      if (t < 1) raf.current = requestAnimationFrame(tick);
      else finish();
    };
    raf.current = requestAnimationFrame(tick);

    // Fallback timeout in case rAF is throttled or suspended.
    const bail = setTimeout(finish, DURATION_MS + 600);

    // Any interaction, or the tab being hidden, ends the intro.
    const skip = () => finish();
    window.addEventListener("pointerdown", skip);
    window.addEventListener("keydown", skip);
    window.addEventListener("wheel", skip, { passive: true });
    document.addEventListener("visibilitychange", skip);

    return () => {
      cancelAnimationFrame(raf.current);
      clearTimeout(bail);
      window.removeEventListener("pointerdown", skip);
      window.removeEventListener("keydown", skip);
      window.removeEventListener("wheel", skip);
      document.removeEventListener("visibilitychange", skip);
    };
  }, []);

  return (
    <PreloaderContext.Provider
      value={{ isLoading, percent, bypassLoading: () => setIsLoading(false) }}
    >
      <AnimatePresence mode="wait">
        {isLoading && (
          <motion.div
            key="preloader"
            exit={{ y: "-100%" }}
            transition={{ duration: 0.75, ease: [0.76, 0, 0.24, 1], delay: 0.15 }}
            className="pointer-events-none fixed inset-0 z-[5000] flex flex-col items-center justify-center bg-background"
          >
            <div className="instrument-grid pointer-events-none absolute inset-0 opacity-60" />
            <div className="relative flex flex-col items-center gap-6">
              <span className="eyebrow">{profile.handle}</span>
              <span className="font-display text-6xl font-semibold tabular-nums tracking-tight md:text-8xl">
                {percent}
                <span className="text-brand">%</span>
              </span>
              <div className="h-px w-56 overflow-hidden bg-border md:w-80">
                <motion.div
                  className="h-full bg-brand"
                  style={{ width: `${percent}%` }}
                  aria-hidden
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {children}
    </PreloaderContext.Provider>
  );
}
