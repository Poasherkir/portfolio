import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getProject } from "@/data/portfolio";
import { Section } from "@/components/section";
import { Reveal, WipeReveal } from "@/components/reveal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import ProjectVisual from "@/components/projects/project-visual";
import CountUp from "@/components/count-up";

/** The hook only. The case study page carries the detail. */
export default function Flagship() {
  const project = getProject("briefing-point-go");
  if (!project) return null;

  return (
    <Section id="flagship" className="py-24 md:py-32">
      <div className="container">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <Link
              href={`/projects/${project.slug}`}
              className="group relative block aspect-[16/10] w-full overflow-hidden rounded-xl border border-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-[1.04]">
                <ProjectVisual project={project} priority />
              </div>
              <span className="absolute inset-x-0 bottom-0 flex items-center gap-2 bg-gradient-to-t from-black/80 to-transparent p-5 font-mono text-[0.65rem] uppercase tracking-[0.18em] text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                View case study
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          </Reveal>

          <div>
            <WipeReveal>
              <p className="eyebrow">Flagship</p>
            </WipeReveal>

            <Reveal delay={0.05}>
              <h2 className="mt-4 font-display text-4xl font-bold tracking-tight md:text-5xl">
                {project.title}
              </h2>
            </Reveal>

            <Reveal delay={0.1}>
              <p className="copy-halo mt-4 text-lg leading-relaxed text-muted-foreground">
                {project.tagline}
              </p>
            </Reveal>

            <Reveal delay={0.14}>
              <div className="mt-5 flex flex-wrap items-center gap-2">
                <Badge variant="brand">In production</Badge>
                {project.tags.map((t) => (
                  <Badge key={t} variant="outline">
                    {t}
                  </Badge>
                ))}
              </div>
            </Reveal>

            {project.metrics && project.metrics.length > 0 && (
              <Reveal delay={0.18}>
                <dl className="mt-9 grid grid-cols-3 gap-4 border-y border-border py-6">
                  {project.metrics.map((m) => (
                    <div key={m.label}>
                      <dd>
                        <CountUp
                          value={m.value}
                          className="font-display text-2xl font-bold tracking-tight text-brand md:text-3xl"
                        />
                      </dd>
                      <dt className="mt-1 text-xs leading-snug text-muted-foreground">
                        {m.label}
                      </dt>
                    </div>
                  ))}
                </dl>
              </Reveal>
            )}

            <Reveal delay={0.22}>
              <Button asChild size="lg" className="mt-8">
                <Link href={`/projects/${project.slug}`}>
                  Read the case study
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </Reveal>
          </div>
        </div>
      </div>
    </Section>
  );
}
