import { cn } from "@/lib/utils";
import type { Project } from "@/types";

/** The glyph carries the meaning alongside the colour, not colour alone. */
const STATUS = {
  production: { glyph: "●", label: "Production", tone: "text-brand" },
  active: { glyph: "◐", label: "In development", tone: "text-foreground/70" },
  archived: { glyph: "—", label: "Archived", tone: "text-muted-foreground" },
} satisfies Record<Project["status"], { glyph: string; label: string; tone: string }>;

export default function ProjectStatus({
  status,
  className,
}: {
  status: Project["status"];
  className?: string;
}) {
  const s = STATUS[status];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 font-mono text-[0.65rem] uppercase tracking-[0.18em]",
        "text-muted-foreground",
        className
      )}
    >
      <span aria-hidden className={s.tone}>
        {s.glyph}
      </span>
      {s.label}
    </span>
  );
}
