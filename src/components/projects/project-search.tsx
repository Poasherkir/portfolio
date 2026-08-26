"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Project } from "@/types";
import ProjectStatus from "./project-status";

/**
 * Project search. Matches across title, value prop, tagline, tags and stack,
 * so "aviation" finds the flight bag and the PDF pipeline.
 */
export default function ProjectSearch({ projects }: { projects: Project[] }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [cursor, setCursor] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const reduced = useReducedMotion();

  const haystacks = useMemo(
    () =>
      projects.map((p) => ({
        project: p,
        text: [p.title, p.valueProp, p.tagline, ...p.tags, ...p.stack]
          .join(" ")
          .toLowerCase(),
      })),
    [projects]
  );

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return projects;
    // Every whitespace-separated term must appear somewhere in the record.
    const terms = q.split(/\s+/);
    return haystacks
      .filter(({ text }) => terms.every((t) => text.includes(t)))
      .map(({ project }) => project);
  }, [query, haystacks, projects]);

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setCursor(0);
  }, []);

  const go = useCallback(
    (project: Project) => {
      const href = project.hasCaseStudy
        ? `/projects/${project.slug}`
        : project.links.live ?? null;
      close();
      if (!href) return;
      if (href.startsWith("http")) window.open(href, "_blank", "noopener");
      else router.push(href);
    },
    [close, router]
  );

  // Global shortcut.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Focus the field once the dialog is actually mounted.
  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  // Keep the highlighted row inside the result set as it shrinks.
  useEffect(() => {
    setCursor((c) => Math.min(c, Math.max(results.length - 1, 0)));
  }, [results.length]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      close();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setCursor((c) => (results.length ? (c + 1) % results.length : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setCursor((c) => (results.length ? (c - 1 + results.length) % results.length : 0));
    } else if (e.key === "Enter" && results[cursor]) {
      e.preventDefault();
      go(results[cursor]);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          "inline-flex items-center gap-3 rounded-full border border-border bg-card/75 py-2 pl-4 pr-2.5 text-sm backdrop-blur-sm",
          "text-muted-foreground transition-colors hover:border-brand/45 hover:text-foreground",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        )}
      >
        <Search className="h-3.5 w-3.5" />
        Search the work
        <kbd className="rounded border border-border px-1.5 py-0.5 font-mono text-[0.6rem] text-muted-foreground">
          ⌘K
        </kbd>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduced ? undefined : { opacity: 0 }}
            transition={{ duration: 0.16 }}
            className="fixed inset-0 z-[100] flex items-start justify-center bg-background/90 p-4 pt-[12vh] backdrop-blur-sm"
            onClick={close}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Search projects"
              initial={reduced ? false : { opacity: 0, y: -10, scale: 0.99 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reduced ? undefined : { opacity: 0, y: -6, scale: 0.99 }}
              transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-xl overflow-hidden rounded-xl border border-border bg-card shadow-2xl"
            >
              <div className="flex items-center gap-3 border-b border-border px-4">
                <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={onKeyDown}
                  placeholder="aviation, flutter, offline…"
                  aria-label="Search projects"
                  aria-controls="project-search-results"
                  className="w-full bg-transparent py-4 text-sm outline-none placeholder:text-muted-foreground"
                />
                <kbd className="shrink-0 rounded border border-border px-1.5 py-0.5 font-mono text-[0.6rem] text-muted-foreground">
                  ESC
                </kbd>
              </div>

              <ul id="project-search-results" className="max-h-[52vh] overflow-y-auto p-2">
                {results.map((p, i) => (
                  <li key={p.slug}>
                    <button
                      type="button"
                      onMouseEnter={() => setCursor(i)}
                      onClick={() => go(p)}
                      className={cn(
                        "flex w-full flex-col items-start gap-1 rounded-lg px-3 py-3 text-left transition-colors",
                        i === cursor ? "bg-brand/10" : "hover:bg-secondary/50"
                      )}
                    >
                      <span className="flex w-full items-center justify-between gap-3">
                        <span className="font-display text-sm font-semibold tracking-tight">
                          {p.title}
                        </span>
                        <ProjectStatus status={p.status} />
                      </span>
                      <span className="text-xs leading-relaxed text-muted-foreground">
                        {p.valueProp}
                      </span>
                      <span className="mt-0.5 font-mono text-[0.6rem] uppercase tracking-[0.14em] text-foreground/45">
                        {p.tags.join(" · ")}
                      </span>
                    </button>
                  </li>
                ))}

                {results.length === 0 && (
                  <li className="px-3 py-8 text-center text-sm text-muted-foreground">
                    Nothing matches “{query}”.
                  </li>
                )}
              </ul>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
