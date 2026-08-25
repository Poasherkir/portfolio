import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { about, foundations, proofPillars, skillGroups } from "@/data/portfolio";
import PageHeader from "@/components/page-header";
import { Section } from "@/components/section";
import { Reveal, RevealGroup, RevealItem } from "@/components/reveal";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "About",
  description:
    "Malik Boudine — full-stack and mobile developer in Algiers. Final-year CS student who has been shipping production software since before the degree. Flutter, React, Supabase, Python. EN/FR/AR.",
  alternates: { canonical: "/about" },
};

const PROCESS = [
  {
    n: "01",
    title: "Scope it honestly",
    body: "I would rather tell you a feature is a bad idea in week one than build it and invoice you for it. If a job is not a fit for me, I say so.",
  },
  {
    n: "02",
    title: "Ship in gates",
    body: "Work is broken into milestones you review before I move on. You are never three weeks away from the last thing you actually saw.",
  },
  {
    n: "03",
    title: "Hand it over properly",
    body: "Signed builds, an admin dashboard your team can operate, and documentation in English or French. The goal is that you do not need me on retainer.",
  },
];

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

          <RevealGroup className="mt-12 grid gap-6 md:grid-cols-3">
            {PROCESS.map((step) => (
              <RevealItem
                key={step.n}
                className="rounded-xl border border-border bg-card/75 p-7 backdrop-blur-sm"
              >
                <span className="font-mono text-xs text-brand">{step.n}</span>
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

          {/* The written stack. The home page shows it as a keyboard; this is
              the version you can actually read. */}
          <div className="mt-20 border-t border-border pt-10">
            <p className="eyebrow">Technical range</p>
            <RevealGroup className="mt-6 grid gap-6 md:grid-cols-2">
              {skillGroups.map((group) => (
                <RevealItem
                  key={group.title}
                  className="rounded-xl border border-border bg-card/80 p-7 backdrop-blur-sm"
                >
                  <h3 className="font-display text-lg font-semibold tracking-tight">
                    {group.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">{group.blurb}</p>
                  <ul className="mt-6 space-y-2.5">
                    {group.items.map((item) => (
                      <li key={item.name} className="flex flex-wrap items-baseline gap-x-2">
                        <span className="text-sm font-medium">{item.name}</span>
                        {item.note && (
                          <span className="font-mono text-[0.68rem] text-muted-foreground">
                            — {item.note}
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </RevealItem>
              ))}
            </RevealGroup>
            <p className="mt-8 font-mono text-xs text-muted-foreground">{foundations}</p>
          </div>
        </div>
      </Section>
    </>
  );
}
