import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Project } from "@/types";
import ProjectVisual from "./project-visual";
import ProjectStatus from "./project-status";

/**
 * A featured project. `hero` is the flagship and the only one at that scale;
 * `large` is the rest of the featured set.
 */
export default function FeaturedProject({
  project,
  size = "large",
  reverse = false,
  priority = false,
}: {
  project: Project;
  size?: "hero" | "large";
  reverse?: boolean;
  priority?: boolean;
}) {
  const isHero = size === "hero";
  const href = project.hasCaseStudy ? `/projects/${project.slug}` : project.links.live;
  const cta = project.hasCaseStudy ? "Read case study" : project.links.live ? "Visit it" : null;

  const visual = (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border border-border",
        "transition-colors duration-300 group-hover:border-brand/40",
        isHero ? "aspect-[16/10]" : "aspect-[16/10]"
      )}
    >
      <div className="absolute inset-0 transition-transform duration-500 ease-out group-hover:scale-[1.03]">
        <ProjectVisual
          project={project}
          priority={priority}
          sizes={isHero ? "(max-width: 1024px) 100vw, 55vw" : "(max-width: 1024px) 100vw, 45vw"}
        />
      </div>

      {/* Hover affordance. Hidden from AT — the real link is the title. */}
      {cta && (
        <div
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-end gap-2 p-5",
            "translate-y-2 opacity-0 transition-all duration-300",
            "group-hover:translate-y-0 group-hover:opacity-100"
          )}
        >
          <span className="rounded-full bg-brand px-4 py-2 font-mono text-[0.65rem] uppercase tracking-[0.16em] text-brand-foreground">
            {cta} →
          </span>
        </div>
      )}
    </div>
  );

  const body = (
    <div className={cn("flex flex-col", isHero ? "justify-center" : "")}>
      <ProjectStatus status={project.status} />

      {/* h2, not h3: these are the top-level content of the featured section and
          nothing above them is an h2, so h3 would skip a level. */}
      <h2
        className={cn(
          "mt-4 font-display font-bold tracking-tight",
          isHero ? "text-3xl md:text-5xl" : "text-2xl md:text-3xl"
        )}
      >
        {href ? (
          <Link
            href={href}
            {...(href.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {})}
            className="transition-colors after:absolute after:inset-0 after:content-[''] hover:text-brand"
          >
            {project.title}
          </Link>
        ) : (
          project.title
        )}
      </h2>

      <p
        className={cn(
          "mt-4 max-w-xl leading-relaxed text-muted-foreground",
          isHero ? "text-base md:text-lg" : "text-sm md:text-base"
        )}
      >
        {project.valueProp}
      </p>

      <p className="mt-5 font-mono text-[0.65rem] uppercase tracking-[0.18em] text-foreground/60">
        {project.tags.join(" · ")}
      </p>

      {project.stack.length > 0 && (
        <ul className="mt-4 flex flex-wrap gap-1.5">
          {project.stack.slice(0, isHero ? 6 : 4).map((tech) => (
            <li
              key={tech}
              className="rounded-md border border-border px-2 py-0.5 font-mono text-[0.65rem] text-muted-foreground"
            >
              {tech}
            </li>
          ))}
          {project.stack.length > (isHero ? 6 : 4) && (
            <li className="px-1 py-0.5 font-mono text-[0.65rem] text-muted-foreground">
              +{project.stack.length - (isHero ? 6 : 4)}
            </li>
          )}
        </ul>
      )}

      {cta && href && (
        <p className="mt-7 inline-flex items-center gap-2 text-sm font-medium text-brand">
          {cta}
          {href.startsWith("http") ? (
            <ExternalLink className="h-4 w-4" />
          ) : (
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          )}
        </p>
      )}
    </div>
  );

  return (
    <article
      className={cn(
        "group relative grid items-start gap-8",
        isHero
          ? "lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-14"
          : "lg:grid-cols-2 lg:gap-12"
      )}
    >
      <div className={cn(reverse && "lg:order-2")}>{visual}</div>
      <div className={cn(reverse && "lg:order-1")}>{body}</div>
    </article>
  );
}
