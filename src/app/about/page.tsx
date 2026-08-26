import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { about, deliveryProcess, foundations, proofPillars } from "@/data/portfolio";
import PageHeader from "@/components/page-header";
import { Section } from "@/components/section";
import { Reveal, RevealGroup, RevealItem } from "@/components/reveal";
import { Button } from "@/components/ui/button";
import ExperienceSection from "@/components/sections/experience";
import Engineering from "@/components/sections/engineering";

export const metadata: Metadata = {
  title: "About",
  description:
    "Malik Boudine — full-stack and mobile developer in Algiers. Flutter, React, Supabase and Python, from architecture to deployment. EN/FR/AR.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <PageHeader eyebrow="About" title={about.lead} />

      <Section className="py-16 md:py-24">
        <div className="container">
          <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-20">
            <div className="max-w-2xl space-y-6">
              {about.body.map((para, i) => (
                <Reveal key={i} delay={i * 0.04}>
                  <p className="text-base leading-relaxed text-muted-foreground md:text-lg">
                    {para}
                  </p>
                </Reveal>
              ))}

              <Reveal delay={0.2}>
                <div className="flex flex-wrap gap-3 pt-6">
                  <Button asChild>
                    <Link href="/contact">
                      Work with me
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link href="/cv">Read my CV</Link>
                  </Button>
                </div>
              </Reveal>
            </div>

            <aside className="lg:sticky lg:top-28 lg:self-start">
              <p className="eyebrow">At a glance</p>
              <dl className="mt-5 space-y-5 border-t border-border pt-5">
                {about.facts.map((fact) => (
                  <div key={fact.label}>
                    <dt className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-muted-foreground">
                      {fact.label}
                    </dt>
                    <dd className="mt-1 text-sm">{fact.value}</dd>
                  </div>
                ))}
              </dl>
            </aside>
          </div>
        </div>
      </Section>

      <Section className="border-t border-border py-16 md:py-24">
        <div className="container">
          <p className="eyebrow">How I work</p>
          <h2 className="mt-3 max-w-3xl font-display text-display-sm font-semibold tracking-tighter">
            Small commits, milestone gates, visual verification before moving on.
          </h2>

          <RevealGroup className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {deliveryProcess.map((step) => (
              <RevealItem
                key={step.step}
                className="rounded-xl border border-border bg-card/75 p-7 backdrop-blur-sm"
              >
                <span className="font-mono text-xs text-brand">{step.step}</span>
                <h3 className="mt-4 font-display text-lg font-semibold">{step.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{step.body}</p>
              </RevealItem>
            ))}
          </RevealGroup>

          {/* Proof pillars. They live here rather than on the home page, whose
              stack section is given over to the 3D keyboard. */}
          <div className="mt-20 border-t border-border pt-10">
            <p className="eyebrow">Why me</p>
            <RevealGroup className="mt-6 grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2">
              {proofPillars.map((pillar, i) => (
                <RevealItem key={pillar.id} className="bg-background/88 p-7 backdrop-blur-sm md:p-9">
                  <span className="font-mono text-xs text-brand">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-4 font-display text-xl font-semibold tracking-tight">
                    {pillar.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {pillar.body}
                  </p>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>

          <div className="mt-20 border-t border-border pt-10">
            <p className="eyebrow">Technical range</p>
            <Reveal>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
                {foundations}
              </p>
            </Reveal>
            <Reveal delay={0.08}>
              <Button asChild variant="outline" className="mt-6">
                <Link href="/stack">
                  See the full stack
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </Reveal>
          </div>
        </div>
      </Section>

      <ExperienceSection />
      <Engineering />
    </>
  );
}
