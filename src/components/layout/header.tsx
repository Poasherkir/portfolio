"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { cn } from "@/lib/utils";
import { navLinks, profile } from "@/data/portfolio";
import ThemeToggle from "./theme-toggle";
import SoundToggle from "./sound-toggle";
import NavOverlay from "./nav-overlay";

export default function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 24));

  // Lock the page while the overlay is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <motion.header
        initial={{ y: -72 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.7, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          "fixed inset-x-0 top-0 z-[1000] transition-colors duration-300",
          scrolled || open
            ? "border-b border-border bg-background/88 backdrop-blur-md"
            : "border-b border-transparent"
        )}
      >
        <div className="container flex h-16 items-center justify-between gap-4">
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className="group flex items-center gap-2.5"
            aria-label={`${profile.name} — home`}
          >
            <span className="relative flex h-2.5 w-2.5 shrink-0" aria-hidden>
              <span className="absolute inset-0 animate-blip rounded-full bg-brand" />
              <span className="absolute inset-0 rounded-full bg-brand opacity-40 blur-[3px]" />
            </span>
            <span className="font-display text-sm font-semibold tracking-tight transition-colors group-hover:text-brand">
              {profile.name}
            </span>
            <span className="hidden font-mono text-[0.65rem] uppercase tracking-[0.2em] text-muted-foreground sm:inline">
              / {profile.handle}
            </span>
          </Link>

          {/* Route links inline on desktop. The overlay is a fallback for
              narrow screens, not the only way to move around the site. */}
          <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
            {navLinks
              .filter((l) => !l.href.includes("#"))
              .map((link) => {
                const active =
                  link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "relative rounded-full px-3.5 py-2 text-sm transition-colors",
                      active
                        ? "text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {link.title}
                    {active && (
                      <motion.span
                        layoutId="nav-active"
                        transition={{ type: "spring", stiffness: 380, damping: 32 }}
                        className="absolute inset-x-3.5 -bottom-0.5 h-px bg-brand"
                      />
                    )}
                  </Link>
                );
              })}
          </nav>

          <div className="flex items-center gap-1">
            <span className="mr-2 hidden font-mono text-[0.65rem] uppercase tracking-[0.18em] text-muted-foreground xl:inline">
              {profile.location} · {profile.timezone}
            </span>
            <SoundToggle />
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="nav-overlay"
              className="ml-1 flex h-10 items-center gap-2.5 rounded-full px-3 text-sm transition-colors hover:bg-foreground/[0.05] lg:hidden"
            >
              <span className="hidden font-mono text-[0.7rem] uppercase tracking-[0.18em] sm:inline">
                {open ? "Close" : "Menu"}
              </span>
              <span className="relative flex h-4 w-5 flex-col justify-center" aria-hidden>
                <motion.span
                  animate={open ? { rotate: 45, y: 0 } : { rotate: 0, y: -3 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute h-px w-5 bg-foreground"
                />
                <motion.span
                  animate={open ? { rotate: -45, y: 0 } : { rotate: 0, y: 3 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute h-px w-5 bg-foreground"
                />
              </span>
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence mode="wait">
        {open && <NavOverlay onClose={() => setOpen(false)} />}
      </AnimatePresence>
    </>
  );
}
