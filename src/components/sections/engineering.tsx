import Link from "next/link";
import { ArrowRight, Github, Lock } from "lucide-react";
import { engineering, privateSource, profile } from "@/data/portfolio";
import { Section } from "@/components/section";
import { Reveal, RevealGroup, RevealItem, WipeReveal } from "@/components/reveal";
import { Button } from "@/components/ui/button";

/**
 * Answers "can I see the code?" before it is asked. Not a contribution graph —
 * the shipping work is in private repos, so a public graph would understate it.
 */
export default function Engineering() {
  return (
    <Section id="engineering" className="py-24 md:py-32">
      <div className="container">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-16">
          <div className="max-w-2xl">
            <WipeReveal>
              <p className="eyebrow">Engineering</p>
            </WipeReveal>

            <Reveal delay={0.05}>
              <h2 className="mt-4 font-display text-3xl font-bold tracking-tight md:text-5xl">
                {engineering.title}
              </h2>
            </Reveal>

            <Reveal delay={0.1}>
              <p className="copy-halo mt-5 text-base leading-relaxed text-muted-foreground md:text-lg">
                {engineering.body}
              </p>
            </Reveal>

            <RevealGroup className="mt-10 grid gap-8 sm:grid-cols-2">
              {engineering.practices.map((practice) => (
                <RevealItem key={practice.title}>
                  <h3 className="font-display text-base font-semibold tracking-tight">
                    {practice.title}
                  </h3>
                  <p className="copy-halo mt-2 text-sm leading-relaxed text-muted-foreground">
                    {practice.body}
                  </p>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>

          <Reveal delay={0.12} className="lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-xl border border-border bg-card/80 p-7 backdrop-blur-sm">
              <Lock className="h-5 w-5 text-brand" />
              <h3 className="mt-4 font-display text-lg font-semibold tracking-tight">
                Why the repos are private
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {privateSource.reason}
              </p>

              <div className="mt-6 flex flex-col gap-2.5">
                <Button asChild size="sm">
                  <Link href="/contact">
                    {privateSource.cta}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild size="sm" variant="outline">
                  <Link href={profile.github} target="_blank" rel="noreferrer">
                    <Github className="h-4 w-4" />
                    GitHub
                  </Link>
                </Button>
              </div>

              <p className="mt-5 border-t border-border pt-5 text-xs leading-relaxed text-muted-foreground">
                {engineering.openSource}
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
