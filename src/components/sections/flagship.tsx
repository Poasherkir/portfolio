import Link from "next/link";
import { ArrowRight, Lock } from "lucide-react";
import { getProject, privateSource } from "@/data/portfolio";
import { Section } from "@/components/section";
import { Reveal, RevealGroup, RevealItem, WipeReveal } from "@/components/reveal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import ProjectVisual from "@/components/projects/project-visual";

/** One project with room to be understood: problem, approach, result. */
export default function Flagship() {
  const project = getProject("briefing-point-go");
  if (!project) return null;

  const beats = [
    { label: "The problem", body: project.problem },
    { label: "The approach", body: project.approach },
    { label: "The hard part", body: project.hardPart },
    { label: "The result", body: project.result },
  ].filter((b) => b.body.trim().length > 0);

  return (
    <Section id="flagship" className="py-24 md:py-32">
      <div className="container">
        <WipeReveal>
          <p className="eyebrow">Flagship project</p>
        </WipeReveal>

        <div className="mt-4 grid gap-10 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-16">
          <div>
            <Reveal>
              <h2 className="font-display text-4xl font-bold tracking-tight md:text-6xl">
                {project.title}
              </h2>
            </Reveal>
            <Reveal delay={0.06}>
              <p className="copy-halo mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">
                {project.tagline}
              </p>
            </Reveal>

            <Reveal delay={0.12}>
              <div className="mt-6 flex flex-wrap items-center gap-2">
                <Badge variant="brand">In production</Badge>
                {project.tags.map((t) => (
                  <Badge key={t} variant="outline">
                    {t}
                  </Badge>
                ))}
              </div>
            </Reveal>

            {/* Cover sits inside the column so the story stays the focus. */}
            <Reveal delay={0.16}>
              <div className="relative mt-8 aspect-[16/9] w-full overflow-hidden rounded-xl border border-border">
                <ProjectVisual project={project} priority />
              </div>
            </Reveal>

            <div className="mt-12 space-y-9">
              {beats.map((beat, i) => (
                <Reveal key={beat.label} delay={i * 0.04}>
                  <div>
                    <p className="eyebrow">
                      {String(i + 1).padStart(2, "0")} — {beat.label}
                    </p>
                    <p className="copy-halo mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground">
                      {beat.body}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal delay={0.1}>
              <div className="mt-10 flex flex-wrap gap-3">
                <Button asChild>
                  <Link href={`/projects/${project.slug}`}>
                    Read the case study
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/contact">{privateSource.cta}</Link>
                </Button>
              </div>
            </Reveal>
          </div>

          {/* Facts rail */}
          <aside className="lg:sticky lg:top-28 lg:self-start">
            {project.metrics && project.metrics.length > 0 && (
              <RevealGroup className="grid gap-px overflow-hidden rounded-xl border border-border bg-border">
                {project.metrics.map((m) => (
                  <RevealItem key={m.label} className="bg-background/88 p-5 backdrop-blur-sm">
                    <p className="font-display text-3xl font-bold tracking-tight text-brand">
                      {m.value}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">{m.label}</p>
                  </RevealItem>
                ))}
              </RevealGroup>
            )}

            <Reveal delay={0.1}>
              <dl className="mt-6 space-y-5 rounded-xl border border-border bg-card/80 p-6 backdrop-blur-sm">
                <div>
                  <dt className="eyebrow">Role</dt>
                  <dd className="mt-1.5 text-sm">{project.role}</dd>
                </div>
                <div>
                  <dt className="eyebrow">Stack</dt>
                  <dd className="mt-2 flex flex-wrap gap-1.5">
                    {project.stack.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-md border border-border px-2 py-0.5 font-mono text-[0.65rem] text-muted-foreground"
                      >
                        {tech}
                      </span>
                    ))}
                  </dd>
                </div>
                <div>
                  <dt className="eyebrow">Source</dt>
                  <dd className="mt-1.5 flex items-start gap-2 text-sm text-muted-foreground">
                    <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand" />
                    {privateSource.label}
                  </dd>
                </div>
              </dl>
            </Reveal>
          </aside>
        </div>
      </div>
    </Section>
  );
}
