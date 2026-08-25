"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { hero, profile, socials } from "@/data/portfolio";
import { Button } from "@/components/ui/button";
import { BlurIn } from "@/components/reveal";
import ScrollCue from "@/components/scroll-cue";
import SocialIcon from "@/components/layout/social-icon";
import { usePreloader } from "@/components/preloader";
import { cn } from "@/lib/utils";

/**
 * Developer first, name second.
 *
 * The 3D board is already the visual hero and owns the right-hand column, so
 * the copy here stays deliberately spare: what he does, in three lines, one
 * sentence of substance, and two ways to act on it. Anything more competes
 * with the keyboard instead of supporting it.
 */
export default function Hero() {
  // The hero always renders — gating it on the preloader would ship an empty
  // <h1> to crawlers and flash a blank screen. Instead the entrance is simply
  // delayed so it finishes settling as the intro panel lifts away.
  const { isLoading } = usePreloader();
  const offset = isLoading ? 0.7 : 0;

  return (
    <section id="hero" className="relative min-h-[100svh] w-full md:h-dvh">
      <div className="grid md:grid-cols-2">
        <div
          className={cn(
            "z-[2] min-h-[calc(100svh-3rem)] md:h-[calc(100dvh-4rem)]",
            "col-span-1",
            "flex flex-col items-start justify-center",
            "px-5 pt-28 sm:pb-16 md:p-20 lg:p-24 xl:p-28"
          )}
        >
          <BlurIn delay={offset + 0.15}>
            <p className="eyebrow">{hero.eyebrow}</p>
          </BlurIn>

          <h1 className="mt-5">
            <span className="sr-only">
              {profile.name} — {hero.displayLines.join(" ")}
            </span>
            {hero.displayLines.map((line, i) => (
              <BlurIn key={line} delay={offset + 0.3 + i * 0.11}>
                <span
                  aria-hidden
                  className={cn(
                    "block font-display leading-[0.94] tracking-tight",
                    "text-5xl sm:text-6xl lg:text-7xl xl:text-[5.5rem]",
                    i === hero.displayLines.length - 1
                      ? "text-brand"
                      : "text-slate-900 dark:text-slate-50"
                  )}
                >
                  {line}
                </span>
              </BlurIn>
            ))}
          </h1>

          <BlurIn delay={offset + 0.72}>
            <p className="mt-7 max-w-lg text-sm font-normal leading-relaxed text-muted-foreground sm:text-base">
              {hero.subhead}
            </p>
          </BlurIn>

          <BlurIn delay={offset + 0.85}>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Button asChild size="lg">
                <Link href={hero.primaryCta.href}>
                  {hero.primaryCta.label}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href={hero.secondaryCta.href}>{hero.secondaryCta.label}</Link>
              </Button>

              <div className="flex items-center gap-2">
                {/* asChild, not <Link><Button> — nesting a button inside an
                    anchor is invalid HTML, and the inner control ends up with
                    no accessible name of its own. */}
                {socials.map((s) => (
                  <Button key={s.title} asChild variant="outline" size="icon">
                    <Link href={s.href} target="_blank" rel="noreferrer" aria-label={s.title}>
                      <SocialIcon name={s.icon} className="h-4 w-4" />
                    </Link>
                  </Button>
                ))}
              </div>
            </div>
          </BlurIn>

          {/* Rendered only while it is actually true — set to null when booked. */}
          {hero.availability && (
            <BlurIn delay={offset + 0.98}>
              <p className="mt-7 flex items-center gap-2.5 text-xs text-muted-foreground">
                <span className="relative flex h-2 w-2 shrink-0" aria-hidden>
                  <span className="absolute inset-0 animate-blip rounded-full bg-brand" />
                  <span className="absolute inset-0 rounded-full bg-brand opacity-40 blur-[3px]" />
                </span>
                {hero.availability}
                <span className="hidden text-muted-foreground/60 sm:inline">
                  · {profile.location} · {profile.timezone}
                </span>
              </p>
            </BlurIn>
          )}
        </div>

        {/* Right column is deliberately empty — the 3D keyboard lives here. */}
        <div className="col-span-1 grid" />
      </div>

      <div className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 md:block">
        <ScrollCue />
      </div>
    </section>
  );
}
