import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ExternalLink, Github, Lock } from "lucide-react";

import { caseStudies, getProject, privateSource, profile } from "@/data/portfolio";
import { absoluteUrl } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/reveal";
import ProjectVisual from "@/components/projects/project-visual";
import ProjectStatus from "@/components/projects/project-status";
import CaseStudyNav from "@/components/projects/case-study-nav";
import ArchitectureDiagram from "@/components/projects/architecture-diagram";
import BeforeAfter from "@/components/projects/before-after";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return caseStudies.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};

  return {
    title: project.title,
    description: project.tagline,
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: {
      title: `${project.title} — ${profile.name}`,
      description: project.tagline,
      url: absoluteUrl(`/projects/${project.slug}`),
      // Falls back to the generated site-wide OG image until a real screenshot
      // exists for this project.
      ...(project.images[0]
        ? { images: [{ url: project.images[0].src, width: 1200, height: 630 }] }
        : {}),
    },
  };
}

const pad = (n: number) => String(n).padStart(2, "0");

/** A prose section. Rendered narrow — long lines are hard to read. */
function Prose({
  n,
  section,
}: {
  n: number;
  section: { key: string; label: string; body: string };
}) {
  if (!section.body.trim()) return null;

  return (
    <Reveal as="section">
      <div id={section.key} className="max-w-2xl scroll-mt-28">
        <p className="eyebrow">
          {pad(n)} — {section.label}
        </p>
        <h2 className="mt-3 font-display text-2xl font-semibold tracking-tight md:text-3xl">
          {section.label}
        </h2>
        <p className="mt-5 text-base leading-relaxed text-muted-foreground md:text-lg">
          {section.body}
        </p>
      </div>
    </Reveal>
  );
}

export default async function CaseStudyPage({ params }: Params) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project || !project.hasCaseStudy) notFound();

  const index = caseStudies.findIndex((p) => p.slug === project.slug);
  const next = caseStudies[(index + 1) % caseStudies.length];
  const prev = caseStudies[(index - 1 + caseStudies.length) % caseStudies.length];

  const prose = {
    problem: { key: "problem", label: "The problem", body: project.problem },
    approach: { key: "approach", label: "The approach", body: project.approach },
    hardPart: { key: "hardPart", label: "The hard part", body: project.hardPart },
    result: { key: "result", label: "The result", body: project.result },
  };

  /**
   * Contents in reading order, including the sections that are not prose.
   * Built from what this project actually has — a case study with no
   * architecture data simply does not get an Architecture entry, rather than
   * getting an empty one.
   */
  const contents: { key: string; label: string }[] = [
    prose.problem,
    prose.approach,
    ...(project.architecture ? [{ key: "architecture", label: "Architecture" }] : []),
    ...(project.beforeAfter ? [{ key: "pipeline", label: "Before / after" }] : []),
    prose.hardPart,
    prose.result,
    ...(project.whyItMatters ? [{ key: "why", label: "Why it matters" }] : []),
  ]
    .filter((s) => !("body" in s) || String(s.body).trim().length > 0)
    .map(({ key, label }) => ({ key, label }));

  /** Position of a section in the contents, 1-based. */
  const num = (key: string) => contents.findIndex((c) => c.key === key) + 1;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    abstract: project.tagline,
    creator: { "@type": "Person", name: profile.name, url: profile.site },
    url: absoluteUrl(`/projects/${project.slug}`),
    keywords: [...project.stack, ...project.tags].join(", "),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article>
        <header className="relative border-b border-border pb-14 pt-36 md:pb-20 md:pt-44">
          <div className="container">
            <Link
              href="/projects"
              className="group inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground transition-colors hover:text-brand"
            >
              <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
              All projects
            </Link>

            <div className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2">
              <ProjectStatus status={project.status} />
              <span aria-hidden className="h-3 w-px bg-border" />
              <span className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-foreground/60">
                {project.tags.join(" · ")}
              </span>
            </div>

            <h1 className="mt-6 max-w-4xl font-display text-display-md font-semibold tracking-tighter text-balance">
              {project.title}
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              {project.tagline}
            </p>

            <dl className="mt-10 grid gap-x-8 gap-y-6 border-t border-border pt-8 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <dt className="eyebrow">Role</dt>
                <dd className="mt-1.5 text-sm">{project.role}</dd>
              </div>
              <div>
                <dt className="eyebrow">Timeframe</dt>
                <dd className="mt-1.5 text-sm">{project.year}</dd>
              </div>
              <div className="lg:col-span-2">
                <dt className="eyebrow">Stack</dt>
                <dd className="mt-1.5 text-sm">
                  {project.stack.length > 0 ? project.stack.join(" · ") : "—"}
                </dd>
              </div>
            </dl>

            {/* Metrics render only when real numbers exist. */}
            {project.metrics && project.metrics.length > 0 && (
              <dl className="mt-8 grid gap-6 border-t border-border pt-8 sm:grid-cols-3">
                {project.metrics.map((m) => (
                  <div key={m.label}>
                    <dt className="eyebrow">{m.label}</dt>
                    <dd className="mt-1 font-display text-3xl font-semibold tracking-tight text-brand">
                      {m.value}
                    </dd>
                  </div>
                ))}
              </dl>
            )}

            <div className="mt-10 flex flex-wrap items-center gap-3">
              {project.links.live && (
                <Button asChild>
                  <a href={project.links.live} target="_blank" rel="noopener noreferrer">
                    Visit it
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              )}
              {project.links.repo && (
                <Button asChild variant="outline">
                  <a href={project.links.repo} target="_blank" rel="noopener noreferrer">
                    <Github className="h-4 w-4" />
                    Source
                  </a>
                </Button>
              )}
              {project.privateRepo && !project.links.repo && (
                <div className="w-full rounded-xl border border-border bg-card/60 p-5 backdrop-blur-sm">
                  <p className="flex items-center gap-2 text-sm font-medium">
                    <Lock className="h-4 w-4 shrink-0 text-brand" />
                    {privateSource.label}
                  </p>
                  <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                    {privateSource.reason}
                  </p>
                  <Button asChild size="sm" className="mt-4">
                    <Link href="/contact">
                      {privateSource.cta}
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Cover */}
        <div className="container -mt-px">
          <div className="relative aspect-[21/9] w-full overflow-hidden rounded-b-xl border-x border-b border-border">
            <ProjectVisual project={project} priority />
          </div>
        </div>

        {/* Body */}
        <div className="container py-20 md:py-28">
          <div className="grid gap-12 lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-16">
            <div className="lg:sticky lg:top-28 lg:self-start">
              <CaseStudyNav sections={contents} />

              {project.relatedRepos && project.relatedRepos.length > 0 && (
                <div className="mt-10 hidden lg:block">
                  <p className="eyebrow">Companion repos</p>
                  <ul className="mt-4 space-y-3">
                    {project.relatedRepos.map((r) => (
                      <li key={r.name} className="text-sm">
                        {r.url ? (
                          <a
                            href={r.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-mono text-xs transition-colors hover:text-brand"
                          >
                            {r.name}
                          </a>
                        ) : (
                          <span className="font-mono text-xs">{r.name}</span>
                        )}
                        {r.note && (
                          <span className="mt-0.5 block text-xs text-muted-foreground">
                            {r.note}
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="space-y-14">
              {/* Numbering is computed from `contents`, so it stays in step with
                  the rail even though the sections render in a fixed order. */}
              <Prose n={num("problem")} section={prose.problem} />
              <Prose n={num("approach")} section={prose.approach} />

              {project.architecture && (
                <Reveal as="section">
                  <div id="architecture" className="scroll-mt-28">
                    <p className="eyebrow">{pad(num("architecture"))} — Architecture</p>
                    <h2 className="mt-3 font-display text-2xl font-semibold tracking-tight md:text-3xl">
                      Architecture
                    </h2>
                    <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
                      The layers this product actually has, and what sits in each one.
                    </p>
                    <div className="mt-8">
                      <ArchitectureDiagram projects={[project]} />
                    </div>
                  </div>
                </Reveal>
              )}

              {project.beforeAfter && (
                <Reveal as="section">
                  <div id="pipeline" className="scroll-mt-28">
                    <p className="eyebrow">{pad(num("pipeline"))} — Before / after</p>
                    <h2 className="mt-3 font-display text-2xl font-semibold tracking-tight md:text-3xl">
                      What changed
                    </h2>
                    <div className="mt-8">
                      <BeforeAfter data={project.beforeAfter} />
                    </div>
                  </div>
                </Reveal>
              )}

              <Prose n={num("hardPart")} section={prose.hardPart} />

              {/* Real product shots, where a public URL made them possible. */}
              {project.images.length > 1 && (
                <Reveal>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {project.images.slice(1).map((img) => (
                      <figure
                        key={img.src}
                        className="relative overflow-hidden rounded-lg border border-border"
                      >
                        <Image
                          src={img.src}
                          alt={img.alt}
                          width={1600}
                          height={1000}
                          loading="lazy"
                          sizes="(max-width: 640px) 100vw, 45vw"
                          className="h-full w-full object-cover object-top"
                        />
                      </figure>
                    ))}
                  </div>
                </Reveal>
              )}

              <Prose n={num("result")} section={prose.result} />

              {project.whyItMatters && (
                <Reveal as="section">
                  <div
                    id="why"
                    className="scroll-mt-28 rounded-xl border border-brand/25 bg-brand/[0.05] p-7 md:p-9"
                  >
                    <p className="eyebrow">{pad(num("why"))} — Why it matters</p>
                    <h2 className="mt-3 font-display text-2xl font-semibold tracking-tight md:text-3xl">
                      Why it matters
                    </h2>
                    <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
                      {project.whyItMatters}
                    </p>
                  </div>
                </Reveal>
              )}
            </div>
          </div>
        </div>

        {/* Case study navigation */}
        <div className="border-t border-border">
          <div className="container py-12">
            <div className="grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-3">
              <Link
                href={`/projects/${prev.slug}`}
                className="group bg-background/80 p-6 backdrop-blur-sm transition-colors hover:bg-card"
              >
                <span className="flex items-center gap-2 font-mono text-[0.62rem] uppercase tracking-[0.16em] text-muted-foreground">
                  <ArrowLeft className="h-3 w-3 transition-transform group-hover:-translate-x-1" />
                  Previous
                </span>
                <span className="mt-2 block font-display text-lg font-semibold tracking-tight transition-colors group-hover:text-brand">
                  {prev.title}
                </span>
              </Link>

              {/* Where you are. Not a link — nothing to go to. */}
              <div className="bg-background/40 p-6 text-center backdrop-blur-sm">
                <span className="font-mono text-[0.62rem] uppercase tracking-[0.16em] text-brand">
                  Currently reading
                </span>
                <span className="mt-2 block font-display text-lg font-semibold tracking-tight">
                  {project.title}
                </span>
                <span className="mt-1 block font-mono text-[0.6rem] text-muted-foreground">
                  {index + 1} of {caseStudies.length}
                </span>
              </div>

              <Link
                href={`/projects/${next.slug}`}
                className="group bg-background/80 p-6 text-right backdrop-blur-sm transition-colors hover:bg-card"
              >
                <span className="flex items-center justify-end gap-2 font-mono text-[0.62rem] uppercase tracking-[0.16em] text-muted-foreground">
                  Next
                  <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                </span>
                <span className="mt-2 block font-display text-lg font-semibold tracking-tight transition-colors group-hover:text-brand">
                  {next.title}
                </span>
              </Link>
            </div>

            <Link
              href="/projects"
              className="mt-8 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground transition-colors hover:text-brand"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              All work
            </Link>
          </div>
        </div>
      </article>
    </>
  );
}
