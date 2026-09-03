"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { hero, profile, socials } from "@/data/portfolio";
import { Button } from "@/components/ui/button";
import { BlurIn } from "@/components/reveal";
import ScrollCue from "@/components/scroll-cue";
import SocialIcon from "@/components/layout/social-icon";
import Magnetic from "@/components/magnetic";
import { usePreloader } from "@/components/preloader";
import { cn } from "@/lib/utils";

/** The board owns the right column, so the copy here stays spare. */
export default function Hero() {
  // Always renders — gating on the preloader would ship an empty <h1>.
  // The entrance is delayed instead, to settle as the intro panel lifts.
  const { isLoading } = usePreloader();
  const offset = isLoading ? 0.7 : 0;

  return (
    <section id="hero" className="relative min-h-[100svh] w-full md:h-dvh">
      <div className="grid md:grid-cols-2">
        <div
          className={cn(
            "z-[2] min-h-[calc(100svh-3rem)] md:h-[calc(100dvh-4rem)]",
            "col-span-1 flex flex-col items-start justify-center",
            "px-gutter pt-28 sm:pb-16 md:py-20 lg:py-24"
          )}
        >
          <BlurIn delay={offset + 0.15}>
            <p className="eyebrow">{hero.eyebrow}</p>
          </BlurIn>

          <h1 className="mt-6">
            <span className="sr-only">
              {profile.name} — {hero.displayLines.join(" ")}
            </span>
            {hero.displayLines.map((line, i) => (
              <BlurIn key={line} delay={offset + 0.3 + i * 0.11}>
                <span
                  aria-hidden
                  className="block font-display text-display-2xl text-foreground"
                >
                  {/* Only the last word carries the accent — a whole red line
                      at this size is a block of colour, not emphasis. */}
                  {line === hero.displayLines[hero.displayLines.length - 1] ? (
                    <>
                      {line.replace(hero.accentWord, "")}
                      <span className="text-brand">{hero.accentWord}</span>
                    </>
                  ) : (
                    line
                  )}
                </span>
              </BlurIn>
            ))}
          </h1>

          <BlurIn delay={offset + 0.72}>
            <p className="copy-halo mt-8 max-w-[46ch] text-body-lg text-muted-foreground">
              {hero.subhead}
            </p>
          </BlurIn>

          {/* One primary. The secondary is a link, so the eye has an order to
              follow instead of two buttons of equal weight. */}
          <BlurIn delay={offset + 0.85}>
            <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
              <Magnetic>
                <Button asChild size="lg">
                  <Link href={hero.primaryCta.href}>
                    {hero.primaryCta.label}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </Magnetic>

              <Button asChild variant="link" size="lg">
                <Link href={hero.secondaryCta.href}>{hero.secondaryCta.label}</Link>
              </Button>

              <div className="flex items-center gap-1">
                {socials.map((s) => (
                  <Link
                    key={s.title}
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={s.title}
                    className="grid h-10 w-10 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-foreground/[0.05] hover:text-foreground"
                  >
                    <SocialIcon name={s.icon} className="h-4 w-4" />
                  </Link>
                ))}
              </div>
            </div>
          </BlurIn>

          {/* The delivery, in order. Structure where the logos are scattered. */}
          <BlurIn delay={offset + 0.95}>
            <ol className="mt-14 flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-border pt-6">
              {hero.pipeline.map((stage, i) => (
                <li key={stage} className="flex items-center gap-3">
                  <span className="font-mono text-meta uppercase text-muted-foreground">
                    {stage}
                  </span>
                  {i < hero.pipeline.length - 1 && (
                    <span aria-hidden className="text-foreground/25">
                      /
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </BlurIn>

          {/* Rendered only while it is actually true — set to null when booked. */}
          {hero.availability && (
            <BlurIn delay={offset + 1.02}>
              <p className="mt-7 flex items-center gap-2.5 text-xs text-muted-foreground">
                <span className="relative flex h-1.5 w-1.5 shrink-0" aria-hidden>
                  <span className="absolute inset-0 animate-blip rounded-full bg-brand" />
                  <span className="absolute inset-0 rounded-full bg-brand opacity-40 blur-[3px]" />
                </span>
                {hero.availability}
                <span className="hidden text-muted-foreground/70 sm:inline">
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
