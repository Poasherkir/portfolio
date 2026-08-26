"use client";

import { useState } from "react";
import { ClipboardList, X } from "lucide-react";
import { CONTENT_CHECKLIST } from "@/data/portfolio";

/**
 * Dev-only reminder of what content is still missing. Anything unknown is not
 * rendered at all, which is easy to forget about. Compiled out in production.
 */
export default function DevChecklist() {
  const [open, setOpen] = useState(false);

  if (process.env.NODE_ENV === "production") return null;

  const areas = Array.from(new Set(CONTENT_CHECKLIST.map((c) => c.area)));

  return (
    <div className="fixed bottom-4 left-4 z-[4000] print:hidden">
      {open ? (
        <div className="max-h-[70vh] w-[min(92vw,26rem)] overflow-auto rounded-xl border border-border bg-popover/95 p-4 shadow-2xl backdrop-blur">
          <div className="mb-3 flex items-center justify-between">
            <p className="font-display text-sm font-semibold">
              Content still to fill
              <span className="ml-2 font-mono text-xs text-brand">
                {CONTENT_CHECKLIST.length}
              </span>
            </p>
            <button onClick={() => setOpen(false)} aria-label="Close checklist">
              <X className="h-4 w-4" />
            </button>
          </div>
          <p className="mb-4 text-xs text-muted-foreground">
            Dev only. Nothing below is rendered to visitors — missing content is omitted, never
            faked. Edit <code className="text-brand">src/data/portfolio.ts</code>.
          </p>
          {areas.map((area) => (
            <div key={area} className="mb-3">
              <p className="eyebrow mb-1.5">{area}</p>
              <ul className="space-y-1.5">
                {CONTENT_CHECKLIST.filter((c) => c.area === area).map((c) => (
                  <li key={c.item} className="text-xs leading-relaxed text-muted-foreground">
                    <span className="text-foreground">{c.item}</span>
                    <br />
                    <code className="font-mono text-[0.65rem] text-brand">{c.where}</code>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ) : (
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 rounded-full border border-border bg-popover/90 px-3 py-2 text-xs shadow-lg backdrop-blur transition-colors hover:border-brand"
        >
          <ClipboardList className="h-3.5 w-3.5 text-brand" />
          {CONTENT_CHECKLIST.length} to fill
        </button>
      )}
    </div>
  );
}
