import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { about } from "@/data/portfolio";
import { Section } from "@/components/section";
import { Reveal, WipeReveal } from "@/components/reveal";
import { Button } from "@/components/ui/button";

/**
 * Developer first, student second — that ordering is deliberate. The degree is
 * true and stays on the page, but it is context, not the headline.
 *
 * Deliberately narrative-only: the facts rail that would normally sit beside
 * this (based / studying / languages / status) is already rendered by the
 * Experience section directly below, and printing it twice in one screen is
 * what makes a page feel padded rather than full.
 */
export default function AboutShort() {
  return (
    <Section id="about" className="py-24 md:py-32">
      <div className="container">
        <div className="max-w-3xl">
          <WipeReveal>
            <p className="eyebrow">About</p>
          </WipeReveal>

          <Reveal delay={0.05}>
            <h2 className="mt-4 font-display text-3xl font-bold tracking-tight md:text-5xl">
              I build complete products, not features.
            </h2>
          </Reveal>

          <Reveal delay={0.1}>
            <p className="mt-6 text-base leading-relaxed text-muted-foreground md:text-lg">
              I&apos;m a Computer Science student and independent full-stack and mobile
              developer based in Algeria. Most of what I ship is the whole thing — the
              mobile client, the database schema behind it, the admin dashboard a team runs
              it from, and the signed release that puts it on a device.
            </p>
          </Reveal>

          <Reveal delay={0.14}>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground md:text-lg">
              {about.body[1]}
            </p>
          </Reveal>

          <Reveal delay={0.18}>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild variant="outline">
                <Link href="/about">
                  More about how I work
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="ghost">
                <Link href="/cv">Read my CV</Link>
              </Button>
            </div>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
