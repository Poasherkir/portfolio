import Link from "next/link";
import { ArrowUpRight, Github, Lock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { privateSource } from "@/data/portfolio";
import { cn } from "@/lib/utils";
import type { Project } from "@/types";
import ProjectVisual from "./project-visual";

const STATUS_LABEL: Record<Project["status"], string> = {
  production: "In production",
  active: "In development",
  archived: "Archived",
};

export default function ProjectCard({
  project,
  priority = false,
  className,
}: {
  project: Project;
  priority?: boolean;
  className?: string;
}) {
  // Case studies get their own page; everything else points at its live site or
  // repo. Anything private links nowhere and says so, rather than 404-ing.
  const href = project.hasCaseStudy
    ? `/projects/${project.slug}`
    : project.links.live ?? project.links.repo;

  const classes = cn(
    "group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card/60 backdrop-blur-sm",
    "transition-all duration-300 hover:border-brand/50 hover:bg-card focus-visible:border-brand",
    className
  );

  const body = (
    <>
      <div className="relative aspect-[16/10] w-full overflow-hidden border-b border-border">
        <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-[1.04]">
          <ProjectVisual project={project} priority={priority} />
        </div>

        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
          <Badge variant={project.status === "production" ? "brand" : "outline"}>
            {STATUS_LABEL[project.status]}
          </Badge>
          {project.privateRepo && (
            <Badge variant="outline" className="gap-1">
              <Lock className="h-3 w-3" />
              Private
            </Badge>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-6">
        {/* Category and year, so a card can be placed at a glance without
            reading the tagline. tags[0] is ordered primary-first in the data. */}
        <div className="mb-2.5 flex items-center gap-2 font-mono text-[0.65rem] uppercase tracking-[0.16em] text-muted-foreground">
          <span className="text-brand">{project.tags[0]}</span>
          <span aria-hidden className="h-3 w-px bg-border" />
          <span>{project.year}</span>
        </div>

        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-xl font-semibold tracking-tight transition-colors group-hover:text-brand">
            {project.title}
          </h3>
          {href && (
            <ArrowUpRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand" />
          )}
        </div>

        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{project.tagline}</p>

        {project.stack.length > 0 && (
          <ul className="mt-5 flex flex-wrap gap-1.5">
            {project.stack.slice(0, 5).map((s) => (
              <li
                key={s}
                className="rounded-md border border-border px-2 py-0.5 font-mono text-[0.65rem] text-muted-foreground"
              >
                {s}
              </li>
            ))}
            {project.stack.length > 5 && (
              <li className="px-1 py-0.5 font-mono text-[0.65rem] text-muted-foreground">
                +{project.stack.length - 5}
              </li>
            )}
          </ul>
        )}

        <div className="mt-auto flex items-center gap-3 pt-6 font-mono text-[0.65rem] uppercase tracking-[0.16em] text-muted-foreground">
          {project.hasCaseStudy ? (
            <span className="text-brand">Read the case study</span>
          ) : project.privateRepo ? (
            <span>{privateSource.cta}</span>
          ) : href ? (
            <span className="flex items-center gap-1.5">
              <Github className="h-3 w-3" /> Source
            </span>
          ) : null}
        </div>
      </div>
    </>
  );

  if (!href) return <div className={classes}>{body}</div>;

  if (href.startsWith("http")) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
        {body}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {body}
    </Link>
  );
}
