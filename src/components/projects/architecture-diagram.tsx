"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { architectureIntro, architectureLayers } from "@/data/portfolio";
import { cn } from "@/lib/utils";
import type { Project } from "@/types";

/**
 * The layered architecture, per project.
 *
 * The honest part is the dimming. Selecting the PDF pipeline lights up exactly
 * one layer, because that is all it has — it is a document pipeline, not an
 * application. A diagram where every project filled all seven rows would be
 * wallpaper; one that visibly empties is making a claim you can check against
 * the case study.
 */
export default function ArchitectureDiagram({ projects }: { projects: Project[] }) {
  // Only projects whose layers are actually documented can be shown here.
  const selectable = projects.filter((p) => p.architecture);
  const [activeSlug, setActiveSlug] = useState(selectable[0]?.slug ?? "");
  const reduced = useReducedMotion();

  const active = selectable.find((p) => p.slug === activeSlug) ?? selectable[0];
  if (!active) return null;

  const arch = active.architecture ?? {};
  const filledCount = architectureLayers.filter((l) => (arch[l.id]?.length ?? 0) > 0).length;

  return (
    <div>
      {/* Project selector */}
      <div
        role="tablist"
        aria-label="Show architecture for project"
        className="flex flex-wrap gap-2"
      >
        {selectable.map((p) => {
          const isActive = p.slug === active.slug;
          return (
            <button
              key={p.slug}
              role="tab"
              type="button"
              aria-selected={isActive}
              onClick={() => setActiveSlug(p.slug)}
              className={cn(
                "relative rounded-full border px-4 py-2 text-sm transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                isActive
                  ? "border-brand text-brand-foreground"
                  : "border-border text-muted-foreground hover:border-brand/50 hover:text-foreground"
              )}
            >
              {isActive && (
                <motion.span
                  layoutId="arch-pill"
                  className="absolute inset-0 rounded-full bg-brand"
                  transition={
                    reduced
                      ? { duration: 0 }
                      : { type: "spring", stiffness: 380, damping: 32 }
                  }
                />
              )}
              <span className="relative">{p.title}</span>
            </button>
          );
        })}
      </div>

      <p className="mt-5 font-mono text-xs text-muted-foreground">
        {filledCount} of {architectureLayers.length} layers
        <span className="mx-2 text-border">·</span>
        {active.valueProp}
      </p>

      {/* Layer stack */}
      <ol className="mt-8 space-y-px overflow-hidden rounded-xl border border-border bg-border">
        {architectureLayers.map((layer, i) => {
          const items = arch[layer.id] ?? [];
          const filled = items.length > 0;

          return (
            <li key={layer.id} className="relative bg-background/90 backdrop-blur-sm">
              <div
                className={cn(
                  "grid gap-4 p-5 transition-opacity duration-300 md:grid-cols-[13rem_minmax(0,1fr)] md:gap-8 md:p-6",
                  filled ? "opacity-100" : "opacity-35"
                )}
              >
                <div className="flex items-baseline gap-3">
                  <span
                    aria-hidden
                    className={cn(
                      "font-mono text-[0.65rem]",
                      filled ? "text-brand" : "text-muted-foreground"
                    )}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <p className="font-display text-sm font-semibold tracking-tight">
                      {layer.label}
                    </p>
                    <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                      {layer.role}
                    </p>
                  </div>
                </div>

                <div className="min-w-0">
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.ul
                      key={active.slug}
                      initial={reduced ? false : { opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={reduced ? undefined : { opacity: 0, y: -4 }}
                      transition={{ duration: 0.22, delay: reduced ? 0 : i * 0.025 }}
                      className="flex flex-wrap gap-1.5"
                    >
                      {filled ? (
                        items.map((tech) => (
                          <li
                            key={tech}
                            className="rounded-md border border-brand/25 bg-brand/[0.07] px-2.5 py-1 font-mono text-[0.68rem] text-foreground"
                          >
                            {tech}
                          </li>
                        ))
                      ) : (
                        <li className="font-mono text-[0.68rem] text-muted-foreground">
                          Not part of this project
                        </li>
                      )}
                    </motion.ul>
                  </AnimatePresence>
                </div>
              </div>
            </li>
          );
        })}
      </ol>

      <p className="mt-6 max-w-2xl text-sm leading-relaxed text-muted-foreground">
        {architectureIntro.body}
      </p>
    </div>
  );
}
