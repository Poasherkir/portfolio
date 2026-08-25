"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Project, ProjectTag } from "@/types";
import ProjectCard from "./project-card";

const FILTERS: (ProjectTag | "All")[] = ["All", "Mobile", "Web", "Backend", "Automation"];

export default function ProjectGrid({
  projects,
  allProjects,
}: {
  /** The default set — everything not already featured further up the page. */
  projects: Project[];
  /** Every project, including the featured ones. Used only for stack queries. */
  allProjects?: Project[];
}) {
  const [active, setActive] = useState<ProjectTag | "All">("All");
  const router = useRouter();
  const params = useSearchParams();
  const reduced = useReducedMotion();

  /**
   * Continuity with the 3D keyboard on the home page: pressing a keycap can
   * send you here as /projects?stack=flutter. Matched against the real stack
   * strings, case-insensitively, so "flutter" finds "Flutter" and "go_router".
   */
  const stackQuery = params.get("stack")?.trim().toLowerCase() ?? "";

  /**
   * A stack query searches EVERY project, not just the ones in this grid.
   * The two Flutter apps are featured further up the page, so scoping the
   * search to the leftovers made ?stack=flutter answer "nothing" on a site
   * that visibly leads with two Flutter apps.
   */
  const stackMatches = useMemo(() => {
    if (!stackQuery) return null;
    return (allProjects ?? projects).filter((p) =>
      p.stack.some((tech) => tech.toLowerCase().includes(stackQuery))
    );
  }, [projects, allProjects, stackQuery]);

  // Hide a filter entirely if nothing in the visible pool uses that tag — the
  // pool changes under a stack query, and stale chips would show counts of 0.
  const available = useMemo(() => {
    const used = new Set((stackMatches ?? projects).flatMap((p) => p.tags));
    return FILTERS.filter((f) => f === "All" || used.has(f));
  }, [projects, stackMatches]);

  const visible = useMemo(() => {
    const base = stackMatches ?? projects;
    return active === "All" ? base : base.filter((p) => p.tags.includes(active));
  }, [projects, stackMatches, active]);

  // Arriving from a keycap lands mid-page; bring the results into view once.
  const scrolledRef = useRef(false);
  useEffect(() => {
    if (!stackQuery || scrolledRef.current) return;
    scrolledRef.current = true;
    document.getElementById("more-work")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [stackQuery]);

  const clearStack = () => {
    const next = new URLSearchParams(params.toString());
    next.delete("stack");
    const qs = next.toString();
    router.replace(qs ? `/projects?${qs}` : "/projects", { scroll: false });
  };

  return (
    <>
      {/* Segmented filter. One bordered track, one moving indicator — reads as a
          single control rather than five loose chips. */}
      <div
        role="tablist"
        aria-label="Filter projects by type"
        className="inline-flex flex-wrap gap-1 rounded-full border border-border bg-card/75 p-1 backdrop-blur-sm"
      >
        {available.map((filter) => {
          const isActive = filter === active;
          const pool = stackMatches ?? projects;
          const count =
            filter === "All"
              ? pool.length
              : pool.filter((p) => p.tags.includes(filter as ProjectTag)).length;

          return (
            <button
              key={filter}
              role="tab"
              type="button"
              aria-selected={isActive}
              onClick={() => setActive(filter)}
              className={cn(
                "relative rounded-full px-4 py-2 transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                isActive ? "text-brand-foreground" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {isActive && (
                <motion.span
                  layoutId="project-filter-pill"
                  className="absolute inset-0 rounded-full bg-brand"
                  transition={
                    reduced ? { duration: 0 } : { type: "spring", stiffness: 400, damping: 34 }
                  }
                />
              )}
              <span className="relative flex items-baseline gap-1.5">
                <span className="font-mono text-[0.7rem] uppercase tracking-[0.14em]">
                  {filter}
                </span>
                <span className="font-mono text-[0.6rem] opacity-60">{count}</span>
              </span>
            </button>
          );
        })}
      </div>

      {/* Arrived from a keycap — say so, and offer the way out. */}
      {stackMatches && (
        <div className="mt-5 inline-flex items-center gap-3 rounded-full border border-brand/30 bg-brand/[0.07] py-1.5 pl-4 pr-1.5 text-sm">
          <span className="text-muted-foreground">
            Filtered by{" "}
            <span className="font-mono text-foreground">{params.get("stack")}</span>
            <span className="mx-2 text-border">·</span>
            {stackMatches.length} {stackMatches.length === 1 ? "project" : "projects"}
          </span>
          <button
            type="button"
            onClick={clearStack}
            aria-label="Clear technology filter"
            className="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-background hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {visible.map((project, i) => (
            <motion.div
              key={project.slug}
              layout={!reduced}
              initial={reduced ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduced ? undefined : { opacity: 0, y: -8 }}
              transition={{
                duration: reduced ? 0 : 0.32,
                delay: reduced ? 0 : i * 0.03,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="flex"
            >
              <ProjectCard project={project} priority={i < 3} className="w-full" />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {visible.length === 0 && (
        <p className="mt-10 text-sm text-muted-foreground">
          {stackMatches
            ? `Nothing here uses "${params.get("stack")}".`
            : `Nothing tagged ${active} yet.`}
        </p>
      )}
    </>
  );
}
