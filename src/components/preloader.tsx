"use client";

import { AnimatePresence, motion } from "motion/react";
import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { profile } from "@/data/portfolio";

type PreloaderState = {
  isLoading: boolean;
  percent: number;
  /** Skip the intro immediately — the 3D scene calls this once it is ready. */
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

/**
 * Runs once per browser session. A returning visitor clicking through pages
 * should not sit through the intro every time.
 */
export default function Preloader({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [percent, setPercent] = useState(0);
  const raf = useRef<number>(0);

  useEffect(() => {
    const seen =
      typeof window !== "undefined" && window.sessionStorage.getItem(SESSION_KEY) === "1";
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Never play the intro to a tab nobody is looking at. requestAnimationFrame
    // is suspended outright while a document is hidden, so the counter would
    // not tick and — worse — the exit animation could not run, leaving a
    // full-screen overlay stranded over the site. Opening a link in a
    // background tab is common enough that this has to be handled, not hoped
    // about.
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
      // easeOutExpo — fast start, settles on 100
      const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
      setPercent(Math.round(eased * 100));
      if (t < 1) raf.current = requestAnimationFrame(tick);
      else finish();
    };
    raf.current = requestAnimationFrame(tick);

    // Hard backstop. requestAnimationFrame is throttled — or suspended
    // outright — in a background tab, on low-power mode, and in some embedded
    // webviews. Without this the intro never lifts and the entire site sits
    // behind a blank overlay, which is the worst possible failure for a
    // decorative animation.
    const bail = setTimeout(finish, DURATION_MS + 600);

    // Any real interaction means the visitor is done waiting. Also covers the
    // case where the tab is hidden mid-intro and rAF stops.
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
