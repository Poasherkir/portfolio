"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Contents rail for a case study.
 *
 * Desktop: a sticky column that tracks where you are. Mobile: the same list
 * turned into a horizontally scrollable strip pinned under the header, because
 * a vertical rail on a narrow screen costs a whole viewport before the reader
 * reaches the thing it indexes.
 *
 * Scroll-spy uses IntersectionObserver rather than a scroll handler — no
 * layout reads per frame, and it stays correct while smooth scroll is running.
 */
export default function CaseStudyNav({
  sections,
}: {
  sections: { key: string; label: string }[];
}) {
  const [active, setActive] = useState(sections[0]?.key ?? "");
  const stripRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (sections.length === 0) return;

    const seen = new Map<string, number>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          seen.set(entry.target.id, entry.intersectionRatio);
        }
        // Whichever tracked section currently shows the most of itself wins.
        let best = "";
        let bestRatio = 0;
        for (const [id, ratio] of seen) {
          if (ratio > bestRatio) {
            bestRatio = ratio;
            best = id;
          }
        }
        if (best) setActive(best);
      },
      { rootMargin: "-96px 0px -55% 0px", threshold: [0, 0.25, 0.5, 1] }
    );

    for (const s of sections) {
      const el = document.getElementById(s.key);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [sections]);

  // Keep the active chip in view on the mobile strip.
  useEffect(() => {
    const strip = stripRef.current;
    if (!strip) return;
    const chip = strip.querySelector<HTMLElement>(`[data-key="${active}"]`);
    if (!chip) return;
    const left = chip.offsetLeft - strip.clientWidth / 2 + chip.clientWidth / 2;
    strip.scrollTo({ left: Math.max(0, left), behavior: "smooth" });
  }, [active]);

  return (
    <>
      {/* Mobile: horizontal strip */}
      <div className="sticky top-[3.5rem] z-20 -mx-5 border-b border-border bg-background/85 backdrop-blur-md lg:hidden">
        <div
          ref={stripRef}
          className="flex gap-1 overflow-x-auto px-5 py-2.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {sections.map((s) => (
            <a
              key={s.key}
              href={`#${s.key}`}
              data-key={s.key}
              aria-current={active === s.key ? "true" : undefined}
              className={cn(
                "shrink-0 rounded-full px-3 py-1.5 font-mono text-[0.62rem] uppercase tracking-[0.14em] transition-colors",
                active === s.key
                  ? "bg-brand text-brand-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {s.label}
            </a>
          ))}
        </div>
      </div>

      {/* Desktop: sticky rail */}
      <nav
        aria-label="Case study sections"
        className="hidden lg:sticky lg:top-28 lg:block lg:self-start"
      >
        <p className="eyebrow">Contents</p>
        <ul className="mt-4 space-y-1">
          {sections.map((s, i) => {
            const isActive = active === s.key;
            return (
              <li key={s.key}>
                <a
                  href={`#${s.key}`}
                  aria-current={isActive ? "true" : undefined}
                  className={cn(
                    "flex items-baseline gap-3 rounded-md py-1.5 pl-3 text-sm transition-colors",
                    "border-l-2",
                    isActive
                      ? "border-brand text-foreground"
                      : "border-transparent text-muted-foreground hover:border-border hover:text-foreground"
                  )}
                >
                  <span
                    className={cn(
                      "font-mono text-[0.65rem]",
                      isActive ? "text-brand" : "text-muted-foreground/70"
                    )}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {s.label}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
