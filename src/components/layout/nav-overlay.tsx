"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { navLinks, profile, socials } from "@/data/portfolio";
import SocialIcon from "./social-icon";

const panel = {
  initial: { clipPath: "inset(0% 0% 100% 0%)" },
  animate: {
    clipPath: "inset(0% 0% 0% 0%)",
    transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1] as const },
  },
  exit: {
    clipPath: "inset(0% 0% 100% 0%)",
    transition: { duration: 0.55, ease: [0.76, 0, 0.24, 1] as const, delay: 0.16 },
  },
};

const list = {
  animate: { transition: { staggerChildren: 0.06, delayChildren: 0.22 } },
  exit: { transition: { staggerChildren: 0.03, staggerDirection: -1 } },
};

const item = {
  initial: { y: 64, opacity: 0 },
  animate: { y: 0, opacity: 1, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } },
  exit: { y: 34, opacity: 0, transition: { duration: 0.3 } },
};

export default function NavOverlay({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      id="nav-overlay"
      variants={panel}
      initial="initial"
      animate="animate"
      exit="exit"
      className="fixed inset-0 z-[999] bg-background"
    >
      <div className="instrument-grid pointer-events-none absolute inset-0 opacity-70" />

      <motion.nav
        variants={list}
        initial="initial"
        animate="animate"
        exit="exit"
        className="container flex h-full flex-col justify-center pt-20"
      >
        <ul className="flex flex-col">
          {navLinks.map((link, i) => (
            <motion.li key={link.href} variants={item} className="overflow-hidden">
              <Link
                href={link.href}
                onClick={onClose}
                className="group flex items-baseline gap-4 border-b border-border py-4 md:gap-8 md:py-6"
              >
                <span className="w-8 shrink-0 font-mono text-xs text-brand md:w-12">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="font-display text-4xl font-semibold tracking-tight transition-transform duration-300 group-hover:translate-x-2 group-hover:text-brand md:text-6xl">
                  {link.title}
                </span>
                <span className="ml-auto hidden text-sm text-muted-foreground md:block">
                  {link.description}
                </span>
                <ArrowUpRight className="h-5 w-5 shrink-0 -translate-x-2 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100" />
              </Link>
            </motion.li>
          ))}
        </ul>

        <motion.div
          variants={item}
          className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex flex-col gap-1">
            <span className="eyebrow">Elsewhere</span>
            <div className="flex items-center gap-2 pt-1">
              {socials.map((s) => (
                <a
                  key={s.title}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.title}
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-border transition-colors hover:border-brand hover:text-brand"
                >
                  <SocialIcon name={s.icon} className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
          <p className="max-w-sm text-sm text-muted-foreground">{profile.legal}</p>
        </motion.div>
      </motion.nav>
    </motion.div>
  );
}
