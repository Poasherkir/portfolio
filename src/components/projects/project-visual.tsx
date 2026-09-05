import Image from "next/image";
import { cn } from "@/lib/utils";
import type { Project } from "@/types";
import ScreenGallery from "./screen-gallery";
import BrowserFrame from "./browser-frame";

/**
 * Cover art. Uses real screenshots where they exist; otherwise draws a figure
 * from the project's own numbers — a mark per PDF served, a mark per tool
 * shipped. Counts come from project.metrics, never hard-coded here.
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

  // A phone screenshot letterboxed into 16:10 shows almost nothing.
  if (!cover && project.screens?.length) {
    return <ScreenGallery screens={project.screens} priority={priority} className={className} />;
  }

  if (cover) {
    // Staged the same way the phones are, rather than bled to the edges of the
    // card. A browser screenshot stretched corner to corner sits flat next to
    // framed devices and reads as a stretched image; the frame and the backdrop
    // are what make it read as a product shot.
    return (
      <div
        className={cn(
          "absolute inset-0 overflow-hidden bg-secondary dark:bg-[#0c0c0c]",
          className
        )}
      >
        <div className="instrument-grid absolute inset-0 opacity-30" />
        <div
          className="absolute left-1/2 top-1/2 h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-25 blur-[80px]"
          style={{
            background: "radial-gradient(circle, hsl(var(--foreground)) 0%, transparent 65%)",
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center px-7 pb-14 pt-8">
          <BrowserFrame
            src={cover.src}
            alt={cover.alt}
            priority={priority}
            sizes={sizes}
          />
        </div>
      </div>
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
        "absolute inset-0 overflow-hidden bg-secondary dark:bg-[#0c0c0c]",
        className
      )}
      aria-hidden
    >
      <div className="instrument-grid absolute inset-0 opacity-40" />
      <div
        className="absolute -right-1/4 -top-1/3 h-[36rem] w-[36rem] rounded-full opacity-20 blur-[90px]"
        style={{ background: "radial-gradient(circle, hsl(var(--foreground)) 0%, transparent 65%)" }}
      />
      {children}
    </div>
  );
}

/** Caption strip, so the figure is always labelled. */
function Caption({ left, right }: { left: string; right?: string }) {
  return (
    <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5">
      <p className="font-mono text-[0.7rem] uppercase leading-relaxed tracking-[0.16em] text-foreground/55 sm:text-[0.62rem] sm:tracking-[0.18em]">
        {left}
      </p>
      {right && (
        <p className="shrink-0 font-mono text-[0.7rem] uppercase tracking-[0.16em] text-brand/90 sm:text-[0.62rem] sm:tracking-[0.18em]">
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
    case "ofp-api":
      return <FlightPlanPortrait className={className} />;
    case "amadeus-api":
      return <LoadSheetPortrait className={className} />;
    case "bac-dz":
      return <StudyPortrait className={className} />;
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

  // Fixed grid — deterministic, so server and client agree.
  const cols = 10;
  const rows = Math.ceil(tools / cols);

  return (
    <Frame className={className}>
      {/* Horizon line — the instrument the whole site's motif comes from. */}
      <svg viewBox="0 0 400 240" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice">
        <circle cx="200" cy="118" r="98" fill="none" stroke="hsl(var(--foreground))" strokeOpacity="0.16" />
        <circle cx="200" cy="118" r="70" fill="none" stroke="hsl(var(--foreground))" strokeOpacity="0.1" />
        <line x1="72" y1="118" x2="328" y2="118" stroke="hsl(var(--foreground))" strokeOpacity="0.28" />
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
                background: "hsl(var(--foreground))",
                // Front rows brightest, for depth.
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
                background: "hsl(var(--foreground))",
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
              fill="hsl(var(--foreground))"
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
          stroke="hsl(var(--foreground))"
          strokeOpacity="0.6"
          strokeDasharray="4 4"
        />
        <path d="M232 96 l-7 -4 v8 z" fill="hsl(var(--foreground))" fillOpacity="0.8" />
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
          stroke="hsl(var(--foreground))"
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
        <path d={path} fill="none" stroke="hsl(var(--foreground))" strokeOpacity="0.55" strokeWidth="1.5" />
        {stops.map(([x, y], i) => (
          <g key={i}>
            <circle cx={x} cy={y} r="6" fill="#0d0d0d" stroke="hsl(var(--foreground))" strokeOpacity="0.8" />
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
                background: "hsl(var(--foreground))",
                opacity: 0.25 + v * 0.5,
              }}
            />
            <div className="h-px w-full bg-foreground/15" />
          </div>
        ))}
      </div>
      <Caption left="Rate, duration and eligibility in one comparable place" right="MATCHING" />
    </Frame>
  );
}

/* -------------------------------------------------------------------------- */
/* OFP API — a plan document parsed into the figures a pilot needs             */
/* -------------------------------------------------------------------------- */

function FlightPlanPortrait({ className }: { className?: string }) {
  // The real parsed keys, so the picture is the output rather than a mock.
  const fields = [
    ["TRIP FUEL", "4957"],
    ["ETOW", "63262"],
    ["FL", "340"],
    ["ALTN", "2173"],
  ];

  return (
    <Frame className={className}>
      <div className="absolute inset-0 flex items-center justify-center gap-6 p-8 sm:gap-10">
        {/* The document going in: text it cannot read as data. */}
        <div className="flex w-[26%] max-w-[104px] flex-col gap-[3px] rounded-sm border border-foreground/20 p-2.5">
          {Array.from({ length: 9 }).map((_, i) => (
            <span
              key={i}
              className="h-[2px] rounded-full bg-foreground/25"
              style={{ width: `${[92, 74, 88, 60, 80, 46, 84, 68, 38][i]}%` }}
            />
          ))}
        </div>

        <div className="flex flex-col items-center gap-1">
          <span className="font-mono text-[0.5rem] uppercase tracking-[0.16em] text-foreground/45">
            parse
          </span>
          <svg viewBox="0 0 44 8" className="h-2 w-11" aria-hidden>
            <path d="M0 4h36" stroke="hsl(var(--brand))" strokeWidth="1.2" strokeDasharray="3 2.5" />
            <path d="M36 1l6 3-6 3z" fill="hsl(var(--brand))" />
          </svg>
        </div>

        {/* The structured result coming out. */}
        <div className="flex w-[42%] max-w-[168px] flex-col gap-1.5">
          {fields.map(([k, v]) => (
            <div
              key={k}
              className="flex items-baseline justify-between gap-2 rounded-sm border border-foreground/15 bg-foreground/[0.04] px-2 py-1"
            >
              <span className="font-mono text-[0.5rem] uppercase tracking-[0.1em] text-foreground/50">
                {k}
              </span>
              <span className="font-mono text-[0.62rem] tabular-nums text-foreground/85">{v}</span>
            </div>
          ))}
        </div>
      </div>

      <Caption left="Operational flight plan → structured JSON" right="API" />
    </Frame>
  );
}

/* -------------------------------------------------------------------------- */
/* Load Control API — the closeout figures, as a loadsheet                     */
/* -------------------------------------------------------------------------- */

function LoadSheetPortrait({ className }: { className?: string }) {
  const rows = [
    ["PAX", "162"],
    ["BAGS", "1 840"],
    ["ZFW", "54 684"],
    ["TOW", "63 262"],
  ];

  return (
    <Frame className={className}>
      <div className="absolute inset-0 flex items-center justify-center p-8">
        <div className="w-full max-w-[240px] overflow-hidden rounded border border-foreground/20">
          <div className="flex items-center justify-between border-b border-foreground/20 bg-foreground/[0.06] px-3 py-1.5">
            <span className="font-mono text-[0.5rem] uppercase tracking-[0.18em] text-foreground/60">
              Loadsheet
            </span>
            <span className="h-1 w-1 rounded-full bg-brand" />
          </div>
          {rows.map(([k, v], i) => (
            <div
              key={k}
              className={cn(
                "flex items-baseline justify-between px-3 py-[7px]",
                i < rows.length - 1 && "border-b border-foreground/10"
              )}
            >
              <span className="font-mono text-[0.55rem] uppercase tracking-[0.12em] text-foreground/50">
                {k}
              </span>
              <span className="font-mono text-[0.7rem] tabular-nums text-foreground/85">{v}</span>
            </div>
          ))}
        </div>
      </div>

      <Caption left="Live load figures, ground ops → mobile" right="API" />
    </Frame>
  );
}

/* -------------------------------------------------------------------------- */
/* Bac DZ — a curriculum, and how far through it you are                       */
/* -------------------------------------------------------------------------- */

function StudyPortrait({ className }: { className?: string }) {
  const units = [72, 100, 45, 88, 30, 64];

  return (
    <Frame className={className}>
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 p-8">
        <div className="flex w-full max-w-[240px] flex-col gap-2.5">
          {units.map((pct, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="w-8 shrink-0 font-mono text-[0.5rem] uppercase tracking-[0.1em] text-foreground/40">
                U{i + 1}
              </span>
              <span className="h-[3px] flex-1 overflow-hidden rounded-full bg-foreground/12">
                <span
                  className="block h-full rounded-full"
                  style={{
                    width: `${pct}%`,
                    // Only a finished unit earns the accent.
                    background: pct === 100 ? "hsl(var(--brand))" : "hsl(var(--foreground) / 0.45)",
                  }}
                />
              </span>
              <span className="w-7 shrink-0 text-right font-mono text-[0.5rem] tabular-nums text-foreground/40">
                {pct}
              </span>
            </div>
          ))}
        </div>
      </div>

      <Caption left="Curriculum, quizzes and planner · Arabic RTL" right="Study" />
    </Frame>
  );
}

function GenericPortrait({ project, className }: { project: Project; className?: string }) {
  return (
    <Frame className={className}>
      <div className="absolute inset-0 flex items-center justify-center p-8">
        <p className="font-display text-3xl font-semibold leading-none tracking-tighter text-foreground/12">
          {project.title}
        </p>
      </div>
      <Caption left={project.tags.join(" · ")} />
    </Frame>
  );
}
