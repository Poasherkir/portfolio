import { Suspense } from "react";
import type { Metadata } from "next";
import { Lock } from "lucide-react";
import {
  architectureIntro,
  funProjects,
  getProject,
  privateSource,
  projects,
  workPage,
  workProof,
} from "@/data/portfolio";
import { Section } from "@/components/section";
import { Reveal, WipeReveal } from "@/components/reveal";
import FeaturedProject from "@/components/projects/featured-project";
import ProjectGrid from "@/components/projects/project-grid";
import ProjectSearch from "@/components/projects/project-search";
import ArchitectureDiagram from "@/components/projects/architecture-diagram";
import BeforeAfter from "@/components/projects/before-after";

export const metadata: Metadata = {
  title: "Selected work",
  description:
    "Production mobile and web work: an Electronic Flight Bag for commercial aviation, a bilingual subscription marketplace, an offline exam archive, and document automation.",
  alternates: { canonical: "/projects" },
};

/** The three that carry the page. Everything else is "more work". */
const HERO_SLUG = "briefing-point-go";
const FEATURED_SLUGS = ["techsub", "bac-archive"];

export default function ProjectsPage() {
  const hero = getProject(HERO_SLUG);
  const featured = FEATURED_SLUGS.map(getProject).filter(
    (p): p is NonNullable<typeof p> => Boolean(p)
  );

  const featuredSet = new Set([HERO_SLUG, ...FEATURED_SLUGS]);
  const rest = projects.filter((p) => !featuredSet.has(p.slug));

  const pipeline = getProject("briefing-pdf-pipeline");

  return (
    <>
      {/* ------------------------------------------------------------------ */}
      {/* Hero                                                                */}
      {/* ------------------------------------------------------------------ */}
      <Section className="pb-16 pt-36 md:pb-24 md:pt-44">
        <div className="container">
          <WipeReveal>
            <p className="eyebrow">{workPage.eyebrow}</p>
          </WipeReveal>

          <Reveal delay={0.05}>
            <h1 className="mt-5 max-w-4xl font-display text-4xl font-bold tracking-tight text-balance md:text-6xl">
              {workPage.title}
            </h1>
          </Reveal>

          <Reveal delay={0.1}>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
              {workPage.lead}
            </p>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
              <p className="font-mono text-xs uppercase tracking-[0.16em] text-foreground/65">
                {workProof.join("  ·  ")}
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="mt-8">
              <ProjectSearch projects={projects} />
            </div>
          </Reveal>

          {/* Stated once, as policy — not repeated on every card. */}
          <Reveal delay={0.24}>
            <p className="mt-10 flex max-w-2xl gap-3 border-t border-border pt-6 text-sm leading-relaxed text-muted-foreground">
              <Lock className="mt-0.5 h-4 w-4 shrink-0 text-brand" aria-hidden />
              {privateSource.notice}
            </p>
          </Reveal>
        </div>
      </Section>

      {/* ------------------------------------------------------------------ */}
      {/* Featured case studies                                               */}
      {/* ------------------------------------------------------------------ */}
      <Section id="featured" className="pb-20 md:pb-28">
        <div className="container">
          <WipeReveal>
            <p className="eyebrow">Featured case studies</p>
          </WipeReveal>

          {hero && (
            <Reveal delay={0.05}>
              <div className="mt-8">
                <FeaturedProject project={hero} size="hero" priority />
              </div>
            </Reveal>
          )}

          <div className="mt-20 space-y-20 md:mt-24 md:space-y-24">
            {featured.map((project, i) => (
              <Reveal key={project.slug}>
                {/* Alternating sides, so the eye has to travel and the second
                    one does not read as a repeat of the first. */}
                <FeaturedProject project={project} reverse={i % 2 === 1} />
              </Reveal>
            ))}
          </div>
        </div>
      </Section>

      {/* ------------------------------------------------------------------ */}
      {/* Before / after — only where a manual process was actually replaced   */}
      {/* ------------------------------------------------------------------ */}
      {pipeline?.beforeAfter && (
        <Section className="pb-20 md:pb-28">
          <div className="container">
            <div className="rounded-2xl border border-border bg-card/75 p-7 backdrop-blur-sm md:p-10">
              <WipeReveal>
                <p className="eyebrow">Automation, in one picture</p>
              </WipeReveal>
              <Reveal delay={0.05}>
                <h2 className="mt-4 max-w-2xl font-display text-2xl font-bold tracking-tight md:text-3xl">
                  {pipeline.title}
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
                  {pipeline.valueProp}
                </p>
              </Reveal>
              <Reveal delay={0.1}>
                <div className="mt-8">
                  <BeforeAfter data={pipeline.beforeAfter} />
                </div>
              </Reveal>
            </div>
          </div>
        </Section>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* More work                                                           */}
      {/* ------------------------------------------------------------------ */}
      <Section id="more-work" className="pb-20 md:pb-28">
        <div className="container">
          <WipeReveal>
            <p className="eyebrow">More work</p>
          </WipeReveal>
          <Reveal delay={0.05}>
            <h2 className="mt-4 font-display text-2xl font-bold tracking-tight md:text-4xl">
              Browse the work.
            </h2>
          </Reveal>

          <div className="mt-10">
            {/* useSearchParams needs a boundary for the rest of the page to
                stay static. */}
            <Suspense fallback={<div className="h-12" />}>
              <ProjectGrid projects={rest} allProjects={projects} />
            </Suspense>
          </div>

          {funProjects.length > 0 && (
            <div className="mt-16 border-t border-border pt-10">
              <p className="eyebrow">Also on the shelf</p>
              <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
                {funProjects.map((p) => (
                  <li key={p.name} className="text-sm text-muted-foreground">
                    {p.url ? (
                      <a
                        href={p.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono text-foreground transition-colors hover:text-brand"
                      >
                        {p.name}
                      </a>
                    ) : (
                      <span className="font-mono text-foreground">{p.name}</span>
                    )}
                    <span className="ml-2">{p.note}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </Section>

      {/* ------------------------------------------------------------------ */}
      {/* How I build                                                         */}
      {/* ------------------------------------------------------------------ */}
      <Section id="architecture" className="border-t border-border py-20 md:py-28">
        <div className="container">
          <WipeReveal>
            <p className="eyebrow">Technical depth</p>
          </WipeReveal>
          <Reveal delay={0.05}>
            <h2 className="mt-4 font-display text-3xl font-bold tracking-tight md:text-5xl">
              {architectureIntro.title}
            </h2>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-foreground/80 md:text-xl">
              {architectureIntro.lead}
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="mt-12">
              <ArchitectureDiagram projects={projects} />
            </div>
          </Reveal>
        </div>
      </Section>
    </>
  );
}
