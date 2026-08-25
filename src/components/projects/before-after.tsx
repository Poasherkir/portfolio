import { ArrowDown } from "lucide-react";
import type { Project } from "@/types";

/**
 * The manual process, the thing that replaced it, and what comes out.
 *
 * Only rendered where a real manual workflow was genuinely automated — this is
 * a claim about how the work changed, not a layout that every project gets.
 */
export default function BeforeAfter({ data }: { data: NonNullable<Project["beforeAfter"]> }) {
  return (
    <div className="grid items-stretch gap-4 md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]">
      <Column label="Before" tone="muted" items={data.before} />

      <div className="flex items-center justify-center md:flex-col md:gap-3">
        <span className="font-mono text-[0.62rem] uppercase tracking-[0.16em] text-brand">
          {data.via}
        </span>
        <ArrowDown className="h-5 w-5 rotate-90 text-brand md:rotate-0" aria-hidden />
      </div>

      <Column label="After" tone="brand" items={data.after} />
    </div>
  );
}

function Column({
  label,
  items,
  tone,
}: {
  label: string;
  items: string[];
  tone: "muted" | "brand";
}) {
  const isBrand = tone === "brand";

  return (
    <div
      className={
        isBrand
          ? "rounded-xl border border-brand/30 bg-brand/[0.06] p-6"
          : "rounded-xl border border-border bg-card/75 p-6"
      }
    >
      <p className="eyebrow">{label}</p>
      <ul className="mt-4 space-y-2.5">
        {items.map((item) => (
          <li key={item} className="flex gap-2.5 text-sm leading-relaxed text-muted-foreground">
            <span aria-hidden className={isBrand ? "text-brand" : "text-border"}>
              {isBrand ? "→" : "·"}
            </span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
