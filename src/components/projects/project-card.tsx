import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Project } from "@/types";
import ProjectVisual from "./project-visual";
import ProjectStatus from "./project-status";

/**
 * A project in the "more work" grid.
 *
 * Visual first, then status, name, what it is for, and only then what it is
 * made of. The stack pills are deliberately the quietest thing on the card —
 * a technology list is what a CV leads with, and this is not one.
 *
 * No "Private" badge here. It is true of nearly every project, so repeating it
 * seven times says nothing; the page states the policy once instead.
 */
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
    "transition-colors duration-300 hover:border-brand/45 focus-within:border-brand",
    className
  );

  const body = (
    <>
      <div className="relative aspect-[16/10] w-full overflow-hidden border-b border-border">
        <div className="absolute inset-0 transition-transform duration-500 ease-out group-hover:scale-[1.03]">
          <ProjectVisual
            project={project}
            priority={priority}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center justify-between gap-3">
          <ProjectStatus status={project.status} />
          <span className="font-mono text-[0.6rem] uppercase tracking-[0.16em] text-muted-foreground">
            {project.year}
          </span>
        </div>

        <div className="mt-3 flex items-start justify-between gap-3">
          <h3 className="font-display text-xl font-semibold tracking-tight transition-colors group-hover:text-brand">
            {project.title}
          </h3>
          {href && (
            <ArrowUpRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand" />
          )}
        </div>

        <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">{project.valueProp}</p>

        <p className="mt-5 font-mono text-[0.62rem] uppercase tracking-[0.18em] text-foreground/55">
          {project.tags.join(" · ")}
        </p>

        {project.stack.length > 0 && (
          <ul className="mt-3 flex flex-wrap gap-1.5">
            {project.stack.slice(0, 4).map((s) => (
              <li
                key={s}
                className="rounded-md border border-border px-2 py-0.5 font-mono text-[0.62rem] text-muted-foreground"
              >
                {s}
              </li>
            ))}
            {project.stack.length > 4 && (
              <li className="px-1 py-0.5 font-mono text-[0.62rem] text-muted-foreground">
                +{project.stack.length - 4}
              </li>
            )}
          </ul>
        )}

        {project.hasCaseStudy && (
          <p className="mt-auto pt-6 font-mono text-[0.62rem] uppercase tracking-[0.16em] text-brand">
            Read case study →
          </p>
        )}
      </div>
    </>
  );

  if (!href) return <div className={classes}>{body}</div>;

  const isExternal = href.startsWith("http");

  return (
    <div className={classes}>
      {body}
      {/* Stretched link: the whole card is clickable, but only one accessible
          link exists in the tree rather than a card-sized anchor wrapping
          headings and lists. */}
      <Link
        href={href}
        {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        className="absolute inset-0 z-10 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        <span className="sr-only">
          {project.hasCaseStudy ? `Read the ${project.title} case study` : `Open ${project.title}`}
        </span>
      </Link>
    </div>
  );
}
