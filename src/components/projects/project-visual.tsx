import Image from "next/image";
import { cn } from "@/lib/utils";
import type { Project } from "@/types";

/**
 * Cover art for a project card.
 *
 * Screenshots are still pending (see CONTENT_CHECKLIST) and a broken or empty
 * image frame reads worse than no image at all — so when `images` is empty this
 * draws a deterministic instrument-panel cover from the project's own data.
 * The moment a screenshot is added to portfolio.ts it takes over automatically.
 */
export default function ProjectVisual({
  project,
  className,
  priority = false,
}: {
  project: Project;
  className?: string;
  priority?: boolean;
}) {
  const cover = project.images[0];

  if (cover) {
    return (
      <Image
        src={cover.src}
        alt={cover.alt}
        fill
        priority={priority}
        sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
        className={cn("object-cover", className)}
      />
    );
  }

  // Deterministic hue offset per slug, so each card is distinguishable but the
  // set still reads as one system.
  const seed = project.slug.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const rotate = (seed % 40) - 20;

  return (
    <div
      className={cn(
        "absolute inset-0 flex flex-col justify-between overflow-hidden bg-secondary/40 p-6",
        className
      )}
      aria-hidden
    >
      <div
        className="instrument-grid absolute inset-0 opacity-70"
        style={{ transform: `rotate(${rotate / 8}deg) scale(1.4)` }}
      />
      <div
        className="absolute -right-16 -top-16 h-56 w-56 rounded-full opacity-25 blur-3xl"
        style={{ background: "radial-gradient(circle, hsl(var(--brand)) 0%, transparent 65%)" }}
      />

      {/* Concentric rings, echoing the site's attitude-indicator motif. */}
      <svg
        viewBox="0 0 200 200"
        className="absolute -bottom-20 -right-12 h-64 w-64 opacity-[0.35]"
        style={{ transform: `rotate(${rotate}deg)` }}
      >
        <circle cx="100" cy="100" r="86" fill="none" stroke="hsl(var(--brand))" strokeOpacity="0.3" />
        <circle cx="100" cy="100" r="62" fill="none" stroke="hsl(var(--brand))" strokeOpacity="0.2" />
        <circle cx="100" cy="100" r="38" fill="none" stroke="hsl(var(--brand))" strokeOpacity="0.14" />
        {/* Coordinates are rounded before they reach the DOM. Raw trig output
            serialises to slightly different last digits on server and client,
            which React reports as a hydration mismatch. */}
        {Array.from({ length: 12 }).map((_, i) => {
          const a = (i * 30 * Math.PI) / 180;
          const r = (n: number) => Math.round(n * 1000) / 1000;
          return (
            <line
              key={i}
              x1={r(100 + Math.cos(a) * 86)}
              y1={r(100 + Math.sin(a) * 86)}
              x2={r(100 + Math.cos(a) * 96)}
              y2={r(100 + Math.sin(a) * 96)}
              stroke="hsl(var(--foreground))"
              strokeOpacity="0.16"
            />
          );
        })}
      </svg>

      <p className="relative font-mono text-[0.65rem] uppercase tracking-[0.2em] text-muted-foreground">
        {project.tags.join(" · ")}
      </p>
      <p className="relative font-display text-3xl font-semibold leading-none tracking-tighter text-foreground/25">
        {project.title}
      </p>
    </div>
  );
}
