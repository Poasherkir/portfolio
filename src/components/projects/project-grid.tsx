"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils";
import type { Project, ProjectTag } from "@/types";
import ProjectCard from "./project-card";

const FILTERS: (ProjectTag | "All")[] = ["All", "Mobile", "Backend", "Automation", "Web"];

export default function ProjectGrid({ projects }: { projects: Project[] }) {
  const [active, setActive] = useState<ProjectTag | "All">("All");

  // Hide a filter chip entirely if nothing in the data uses that tag.
  const available = useMemo(() => {
    const used = new Set(projects.flatMap((p) => p.tags));
    return FILTERS.filter((f) => f === "All" || used.has(f));
  }, [projects]);

  const visible = useMemo(
    () => (active === "All" ? projects : projects.filter((p) => p.tags.includes(active))),
    [projects, active]
  );

  return (
    <>
      <div role="tablist" aria-label="Filter projects" className="flex flex-wrap gap-2">
        {available.map((filter) => {
          const isActive = filter === active;
          const count =
            filter === "All"
              ? projects.length
              : projects.filter((p) => p.tags.includes(filter as ProjectTag)).length;

          return (
            <button
              key={filter}
              role="tab"
              aria-selected={isActive}
              onClick={() => setActive(filter)}
              className={cn(
                "relative rounded-full border px-4 py-2 text-sm transition-colors",
                isActive
                  ? "border-brand text-brand-foreground"
                  : "border-border text-muted-foreground hover:border-brand/50 hover:text-foreground"
              )}
            >
              {isActive && (
                <motion.span
                  layoutId="filter-pill"
                  className="absolute inset-0 rounded-full bg-brand"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}
              <span className="relative">
                {filter}
                <span className="ml-1.5 font-mono text-[0.65rem] opacity-70">{count}</span>
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {visible.map((project, i) => (
            <motion.div
              key={project.slug}
              layout
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.32, delay: i * 0.03, ease: [0.22, 1, 0.36, 1] }}
              className="flex"
            >
              <ProjectCard project={project} priority={i < 3} className="w-full" />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {visible.length === 0 && (
        <p className="mt-10 text-sm text-muted-foreground">Nothing tagged {active} yet.</p>
      )}
    </>
  );
}
