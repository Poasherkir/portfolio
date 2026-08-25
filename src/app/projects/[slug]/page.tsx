import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ExternalLink, Github, Lock } from "lucide-react";

import { caseStudies, getProject, privateSource, profile } from "@/data/portfolio";
import { absoluteUrl } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/reveal";
import ProjectVisual from "@/components/projects/project-visual";
import type { Project } from "@/types";

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

const STATUS_LABEL: Record<Project["status"], string> = {
  production: "In production",
  active: "In development",
  archived: "Archived",
};

export default async function CaseStudyPage({ params }: Params) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project || !project.hasCaseStudy) notFound();

  const index = caseStudies.findIndex((p) => p.slug === project.slug);
  const next = caseStudies[(index + 1) % caseStudies.length];

  const sections = [
    { key: "problem", label: "The problem", body: project.problem },
    { key: "approach", label: "The approach", body: project.approach },
    { key: "hardPart", label: "The hard part", body: project.hardPart },
    { key: "result", label: "The result", body: project.result },
  ].filter((s) => s.body.trim().length > 0);

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

            <div className="mt-8 flex flex-wrap items-center gap-2">
              <Badge variant={project.status === "production" ? "brand" : "outline"}>
                {STATUS_LABEL[project.status]}
              </Badge>
              {project.tags.map((t) => (
                <Badge key={t} variant="outline">
                  {t}
                </Badge>
              ))}
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
            {/* Sticky contents rail */}
            <nav aria-label="Case study sections" className="lg:sticky lg:top-28 lg:self-start">
              <p className="eyebrow">Contents</p>
              <ul className="mt-4 space-y-2.5">
                {sections.map((s, i) => (
                  <li key={s.key}>
                    <a
                      href={`#${s.key}`}
                      className="flex items-baseline gap-3 text-sm text-muted-foreground transition-colors hover:text-brand"
                    >
                      <span className="font-mono text-[0.65rem] text-brand">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>

              {project.relatedRepos && project.relatedRepos.length > 0 && (
                <div className="mt-10">
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
                        {/* Description omitted until one is written — never padded. */}
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
            </nav>

            <div className="max-w-2xl space-y-14">
              {sections.map((s, i) => (
                <Reveal key={s.key} as="section">
                  <div id={s.key} className="scroll-mt-28">
                    <p className="eyebrow">
                      {String(i + 1).padStart(2, "0")} — {s.label}
                    </p>
                    <h2 className="mt-3 font-display text-2xl font-semibold tracking-tight md:text-3xl">
                      {s.label}
                    </h2>
                    <p className="mt-5 text-base leading-relaxed text-muted-foreground md:text-lg">
                      {s.body}
                    </p>
                  </div>
                </Reveal>
              ))}

              {/* Extra screenshots, once they exist. */}
              {project.images.length > 1 && (
                <div className="grid gap-4 sm:grid-cols-2">
                  {project.images.slice(1).map((img) => (
                    <div
                      key={img.src}
                      className="relative aspect-[4/3] overflow-hidden rounded-lg border border-border"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={img.src} alt={img.alt} className="h-full w-full object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Next case study */}
        <div className="border-t border-border">
          <div className="container py-14">
            <Link href={`/projects/${next.slug}`} className="group flex flex-col gap-2">
              <span className="eyebrow">Next case study</span>
              <span className="flex items-center gap-4 font-display text-3xl font-semibold tracking-tight transition-colors group-hover:text-brand md:text-5xl">
                {next.title}
                <ArrowRight className="h-6 w-6 transition-transform group-hover:translate-x-2" />
              </span>
              <span className="text-sm text-muted-foreground">{next.tagline}</span>
            </Link>
          </div>
        </div>
      </article>
    </>
  );
}
