import Image from "next/image";
import { cn } from "@/lib/utils";
import type { Project } from "@/types";

/**
 * Cover art for a project.
 *
 * Real screenshots win whenever they exist — TechSub has a public URL, so it
 * has real ones. For everything else the source is private and there is no
 * honest screenshot to show, so this draws a *data portrait* instead: a mark
 * per PDF served, a mark per tool shipped, the actual shape of the pipeline.
 *
 * The distinction matters. A fabricated UI mockup would claim something untrue
 * about a product nobody can verify; a diagram built from the project's own
 * published numbers claims exactly what the case study already says. Every
 * count below is read from `project.metrics`, not typed in here.
 */
export default function ProjectVisual({
  project,
  className,
  priority = false,
  sizes = "(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw",
}: {
  project: Project;
  className?: string;
  priority?: boolean;
  sizes?: string;
}) {
  const cover = project.images[0];

  if (cover) {
    return (
      <Image
        src={cover.src}
        alt={cover.alt}
        fill
        priority={priority}
        sizes={sizes}
        className={cn("object-cover object-top", className)}
      />
    );
  }

  return <DataPortrait project={project} className={className} />;
}

/** Pulls a numeric metric back out of the project's own data. */
function metric(project: Project, startsWith: string): number | null {
  const raw = project.metrics?.find((m) => m.label.startsWith(startsWith))?.value;
  if (!raw) return null;
  const n = Number.parseInt(raw.replace(/[^\d]/g, ""), 10);
  return Number.isFinite(n) ? n : null;
}

function Frame({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "absolute inset-0 overflow-hidden bg-[#080d16] dark:bg-[#070c14]",
        className
      )}
      aria-hidden
    >
      <div className="instrument-grid absolute inset-0 opacity-40" />
      <div
        className="absolute -right-1/4 -top-1/3 h-[36rem] w-[36rem] rounded-full opacity-20 blur-[90px]"
        style={{ background: "radial-gradient(circle, hsl(var(--brand)) 0%, transparent 65%)" }}
      />
      {children}
    </div>
  );
}

/** Small caption strip, so the abstraction is always labelled as what it is. */
function Caption({ left, right }: { left: string; right?: string }) {
  return (
    <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5">
      <p className="font-mono text-[0.6rem] uppercase leading-relaxed tracking-[0.18em] text-white/45">
        {left}
      </p>
      {right && (
        <p className="shrink-0 font-mono text-[0.6rem] uppercase tracking-[0.18em] text-brand/80">
          {right}
        </p>
      )}
    </div>
  );
}

function DataPortrait({ project, className }: { project: Project; className?: string }) {
  switch (project.slug) {
    case "briefing-point-go":
      return <AviationPortrait project={project} className={className} />;
    case "bac-archive":
      return <ArchivePortrait project={project} className={className} />;
    case "briefing-pdf-pipeline":
      return <PipelinePortrait className={className} />;
    case "livreurpro":
      return <RoutePortrait className={className} />;
    case "bankidz":
      return <ComparePortrait className={className} />;
    case "gestion-scolarite":
      return <SchemaPortrait className={className} />;
    default:
      return <GenericPortrait project={project} className={className} />;
  }
}

/* -------------------------------------------------------------------------- */
/* Briefing Point Go — one mark per tool, on an attitude-indicator horizon      */
/* -------------------------------------------------------------------------- */

function AviationPortrait({ project, className }: { project: Project; className?: string }) {
  const tools = metric(project, "Reference") ?? 0;
  const sections = metric(project, "Main sections") ?? 0;

  // Marks laid out on a fixed grid: deterministic, so server and client agree.
  const cols = 10;
  const rows = Math.ceil(tools / cols);

  return (
    <Frame className={className}>
      {/* Horizon line — the instrument the whole site's motif comes from. */}
      <svg viewBox="0 0 400 240" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice">
        <circle cx="200" cy="118" r="98" fill="none" stroke="hsl(var(--brand))" strokeOpacity="0.16" />
        <circle cx="200" cy="118" r="70" fill="none" stroke="hsl(var(--brand))" strokeOpacity="0.1" />
        <line x1="72" y1="118" x2="328" y2="118" stroke="hsl(var(--brand))" strokeOpacity="0.28" />
        {[-40, -20, 20, 40].map((d) => (
          <line
            key={d}
            x1={200 - (d > 0 ? 22 : 34)}
            y1={118 + d}
            x2={200 + (d > 0 ? 22 : 34)}
            y2={118 + d}
            stroke="#ffffff"
            strokeOpacity="0.13"
          />
        ))}
      </svg>

      {/* One dot per reference tool. The count is the point. */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="grid gap-[7px]"
          style={{ gridTemplateColumns: `repeat(${cols}, 6px)` }}
        >
          {Array.from({ length: tools }).map((_, i) => (
            <span
              key={i}
              className="h-1.5 w-1.5 rounded-[1px]"
              style={{
                background: "hsl(var(--brand))",
                // Front rows brightest, so it reads as depth rather than noise.
                opacity: 0.85 - (Math.floor(i / cols) / Math.max(rows, 1)) * 0.55,
              }}
            />
          ))}
        </div>
      </div>

      <Caption
        left={`~${tools} reference & calculation tools · ${sections} sections`}
        right="EFB"
      />
    </Frame>
  );
}

/* -------------------------------------------------------------------------- */
/* BAC Archive — one mark per PDF actually served, across the years covered     */
/* -------------------------------------------------------------------------- */

function ArchivePortrait({ project, className }: { project: Project; className?: string }) {
  const pdfs = metric(project, "PDFs served") ?? 0;
  const entries = metric(project, "Exam entries") ?? 0;
  const cols = 28;

  return (
    <Frame className={className}>
      <div className="absolute inset-0 flex items-center justify-center p-8">
        <div
          className="grid gap-[3px]"
          style={{ gridTemplateColumns: `repeat(${cols}, 5px)` }}
        >
          {Array.from({ length: pdfs }).map((_, i) => (
            <span
              key={i}
              className="h-[7px] w-[5px] rounded-[1px]"
              style={{
                background: "hsl(var(--brand))",
                // A steady vertical gradient — a shelf of paper, seen edge-on.
                opacity: 0.28 + ((i % cols) / cols) * 0.5,
              }}
            />
          ))}
        </div>
      </div>

      <Caption
        left={`${pdfs} PDFs · ${entries} exam entries · 2008–2026`}
        right="OFFLINE"
      />
    </Frame>
  );
}

/* -------------------------------------------------------------------------- */
/* PDF pipeline — many messy pages in, one clean page out                      */
/* -------------------------------------------------------------------------- */

function PipelinePortrait({ className }: { className?: string }) {
  return (
    <Frame className={className}>
      <svg
        viewBox="0 0 400 200"
        className="absolute inset-0 h-full w-full"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* In: four pages, deliberately misaligned and different sizes. */}
        {[
          { x: 40, y: 52, w: 52, h: 68, r: -8 },
          { x: 58, y: 62, w: 46, h: 72, r: 4 },
          { x: 78, y: 48, w: 54, h: 62, r: -3 },
          { x: 98, y: 66, w: 44, h: 70, r: 9 },
        ].map((p, i) => (
          <g key={i} transform={`rotate(${p.r} ${p.x + p.w / 2} ${p.y + p.h / 2})`}>
            <rect
              x={p.x}
              y={p.y}
              width={p.w}
              height={p.h}
              rx="2"
              fill="#ffffff"
              fillOpacity="0.05"
              stroke="#ffffff"
              strokeOpacity="0.2"
            />
            {/* The watermark that has to come out of the content stream. */}
            <text
              x={p.x + p.w / 2}
              y={p.y + p.h / 2}
              textAnchor="middle"
              fontSize="7"
              fill="hsl(var(--brand))"
              fillOpacity="0.35"
              transform={`rotate(-32 ${p.x + p.w / 2} ${p.y + p.h / 2})`}
            >
              SPECIMEN
            </text>
          </g>
        ))}

        {/* Through */}
        <line
          x1="160"
          y1="96"
          x2="232"
          y2="96"
          stroke="hsl(var(--brand))"
          strokeOpacity="0.6"
          strokeDasharray="4 4"
        />
        <path d="M232 96 l-7 -4 v8 z" fill="hsl(var(--brand))" fillOpacity="0.8" />
        <text
          x="196"
          y="86"
          textAnchor="middle"
          fontSize="7"
          fill="#ffffff"
          fillOpacity="0.5"
          fontFamily="monospace"
        >
          PyMuPDF
        </text>

        {/* Out: one clean A4, square to the frame, no watermark. */}
        <rect
          x="258"
          y="46"
          width="76"
          height="104"
          rx="2"
          fill="#ffffff"
          fillOpacity="0.1"
          stroke="hsl(var(--brand))"
          strokeOpacity="0.55"
        />
        {[62, 72, 82, 92, 102, 112, 122].map((y, i) => (
          <line
            key={y}
            x1="270"
            y1={y}
            x2={i % 3 === 2 ? 302 : 322}
            y2={y}
            stroke="#ffffff"
            strokeOpacity="0.22"
          />
        ))}
      </svg>

      <Caption left="Watermarked, mixed geometry → one A4 document" right="AUTOMATED" />
    </Frame>
  );
}

/* -------------------------------------------------------------------------- */
/* LivreurPro — a sequenced route instead of doubling back                     */
/* -------------------------------------------------------------------------- */

function RoutePortrait({ className }: { className?: string }) {
  const stops = [
    [58, 150],
    [104, 84],
    [162, 122],
    [214, 62],
    [266, 118],
    [318, 74],
  ] as const;
  const path = stops.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x} ${y}`).join(" ");

  return (
    <Frame className={className}>
      <svg viewBox="0 0 380 200" className="absolute inset-0 h-full w-full">
        <path d={path} fill="none" stroke="hsl(var(--brand))" strokeOpacity="0.55" strokeWidth="1.5" />
        {stops.map(([x, y], i) => (
          <g key={i}>
            <circle cx={x} cy={y} r="6" fill="#080d16" stroke="hsl(var(--brand))" strokeOpacity="0.8" />
            <text
              x={x}
              y={y + 2.5}
              textAnchor="middle"
              fontSize="6"
              fill="#ffffff"
              fillOpacity="0.75"
              fontFamily="monospace"
            >
              {i + 1}
            </text>
          </g>
        ))}
      </svg>
      <Caption left="A day of drops, sequenced once instead of guessed at" right="PWA" />
    </Frame>
  );
}

/* -------------------------------------------------------------------------- */
/* BankiDZ — products that are only comparable side by side                    */
/* -------------------------------------------------------------------------- */

function ComparePortrait({ className }: { className?: string }) {
  const bars = [0.82, 0.54, 0.68, 0.38, 0.74];

  return (
    <Frame className={className}>
      <div className="absolute inset-0 flex items-end justify-center gap-4 px-12 pb-16 pt-12">
        {bars.map((v, i) => (
          <div key={i} className="flex h-full w-10 flex-col justify-end gap-1.5">
            <div
              className="w-full rounded-[2px]"
              style={{
                height: `${v * 100}%`,
                background: "hsl(var(--brand))",
                opacity: 0.25 + v * 0.5,
              }}
            />
            <div className="h-px w-full bg-white/15" />
          </div>
        ))}
      </div>
      <Caption left="Rate, duration and eligibility in one comparable place" right="MATCHING" />
    </Frame>
  );
}

/* -------------------------------------------------------------------------- */
/* Gestion de la Scolarité — a normalised relational schema                    */
/* -------------------------------------------------------------------------- */

function SchemaPortrait({ className }: { className?: string }) {
  const tables = [
    { x: 42, y: 44, label: "etudiants" },
    { x: 160, y: 96, label: "inscriptions" },
    { x: 278, y: 44, label: "modules" },
  ];

  return (
    <Frame className={className}>
      <svg viewBox="0 0 380 200" className="absolute inset-0 h-full w-full">
        <line x1="102" y1="72" x2="160" y2="112" stroke="hsl(var(--brand))" strokeOpacity="0.4" />
        <line x1="220" y1="112" x2="278" y2="72" stroke="hsl(var(--brand))" strokeOpacity="0.4" />
        {tables.map((t) => (
          <g key={t.label}>
            <rect
              x={t.x}
              y={t.y}
              width="60"
              height="56"
              rx="3"
              fill="#ffffff"
              fillOpacity="0.05"
              stroke="#ffffff"
              strokeOpacity="0.2"
            />
            <line
              x1={t.x}
              y1={t.y + 15}
              x2={t.x + 60}
              y2={t.y + 15}
              stroke="#ffffff"
              strokeOpacity="0.2"
            />
            <text
              x={t.x + 30}
              y={t.y + 10.5}
              textAnchor="middle"
              fontSize="6"
              fill="hsl(var(--brand))"
              fillOpacity="0.9"
              fontFamily="monospace"
            >
              {t.label}
            </text>
            {[26, 34, 42, 50].map((dy) => (
              <line
                key={dy}
                x1={t.x + 8}
                y1={t.y + dy}
                x2={t.x + 44}
                y2={t.y + dy}
                stroke="#ffffff"
                strokeOpacity="0.14"
              />
            ))}
          </g>
        ))}
      </svg>
      <Caption left="Normalised schema, full CRUD over students and enrolments" right="ARCHIVED" />
    </Frame>
  );
}

/* -------------------------------------------------------------------------- */
/* Fallback                                                                    */
/* -------------------------------------------------------------------------- */

function GenericPortrait({ project, className }: { project: Project; className?: string }) {
  return (
    <Frame className={className}>
      <div className="absolute inset-0 flex items-center justify-center p-8">
        <p className="font-display text-3xl font-semibold leading-none tracking-tighter text-white/15">
          {project.title}
        </p>
      </div>
      <Caption left={project.tags.join(" · ")} />
    </Frame>
  );
}
