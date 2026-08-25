import type { Metadata } from "next";
import {
  LEVEL_BLURB,
  LEVEL_LABEL,
  languagePriority,
  levelCounts,
  skillAreas,
  type SkillLevel,
} from "@/data/roadmap";
import PageHeader from "@/components/page-header";
import { Section } from "@/components/section";
import { Reveal, RevealGroup, RevealItem } from "@/components/reveal";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Stack",
  description:
    "Everything Malik Boudine works with — frontend, mobile, backend, databases, DevOps, security, testing, architecture, APIs and AI engineering.",
  alternates: { canonical: "/stack" },
};

const LEVEL_STYLE: Record<SkillLevel, string> = {
  shipping: "border-brand/40 bg-brand/10 text-brand",
  working: "border-border bg-secondary/50 text-foreground",
  roadmap: "border-border bg-secondary/50 text-foreground",
};

const LEVEL_DOT: Record<SkillLevel, string> = {
  shipping: "bg-brand",
  working: "bg-foreground/50",
  roadmap: "bg-foreground/50",
};

const ORDER: SkillLevel[] = ["shipping", "working"];

export default function StackPage() {
  const total = levelCounts.shipping + levelCounts.working + levelCounts.roadmap;

  return (
    <>
      <PageHeader
        eyebrow="Stack"
        title="Everything I work with."
        lead="Grouped by what it does. Core stack is what I reach for first and use daily; the rest I have worked with and am comfortable in."
      />

      <Section className="py-14 md:py-20">
        <div className="container">
          {/* Legend + counts */}
          <RevealGroup className="grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2">
            {ORDER.map((level) => (
              <RevealItem key={level} className="bg-background/88 p-6 backdrop-blur-sm">
                <div className="flex items-center gap-2">
                  <span className={cn("h-2 w-2 rounded-full", LEVEL_DOT[level])} />
                  <span className="eyebrow">{LEVEL_LABEL[level]}</span>
                </div>
                <p className="mt-3 font-display text-4xl font-bold tracking-tight">
                  {levelCounts[level]}
                  <span className="ml-1 text-base font-normal text-muted-foreground">
                    / {total}
                  </span>
                </p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {LEVEL_BLURB[level]}
                </p>
              </RevealItem>
            ))}
          </RevealGroup>

          {/* Language priority */}
          <Reveal>
            <div className="mt-14">
              <p className="eyebrow">Languages, by priority</p>
              <div className="mt-5 overflow-x-auto rounded-xl border border-border">
                <table className="w-full min-w-[34rem] border-collapse text-left text-sm">
                  <thead>
                    <tr className="border-b border-border bg-secondary/30">
                      <th className="px-4 py-3 font-medium">Language</th>
                      <th className="px-4 py-3 font-medium">Priority</th>
                      <th className="px-4 py-3 font-medium">Why</th>
                      <th className="px-4 py-3 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {languagePriority.map((row) => (
                      <tr key={row.language} className="border-b border-border last:border-0">
                        <td className="px-4 py-3 font-medium">{row.language}</td>
                        <td className="px-4 py-3">
                          <span className="font-mono text-brand" aria-hidden>
                            {"★".repeat(row.stars)}
                          </span>
                          <span className="sr-only">{row.stars} out of 5</span>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">{row.why}</td>
                        <td className="px-4 py-3">
                          <span
                            className={cn(
                              "inline-flex rounded-full border px-2.5 py-0.5 text-xs",
                              LEVEL_STYLE[row.level]
                            )}
                          >
                            {LEVEL_LABEL[row.level]}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </Reveal>

          {/* Areas */}
          <div className="mt-16 space-y-12">
            {skillAreas.map((area) => (
              <Reveal key={area.id}>
                <section id={area.id} className="scroll-mt-24 border-t border-border pt-10">
                  <div className="flex flex-col gap-2 md:flex-row md:items-baseline md:justify-between">
                    <h2 className="font-display text-2xl font-bold tracking-tight md:text-3xl">
                      {area.title}
                    </h2>
                    <p className="max-w-xl text-sm text-muted-foreground md:text-right">
                      {area.blurb}
                    </p>
                  </div>

                  <ul className="mt-6 flex flex-wrap gap-2">
                    {area.items.map((item) => (
                      <li
                        key={item.name}
                        className={cn(
                          "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm",
                          LEVEL_STYLE[item.level]
                        )}
                        title={`${LEVEL_LABEL[item.level]} — ${LEVEL_BLURB[item.level]}`}
                      >
                        <span
                          className={cn("h-1.5 w-1.5 shrink-0 rounded-full", LEVEL_DOT[item.level])}
                          aria-hidden
                        />
                        {item.name}
                        {item.note && (
                          <span className="font-mono text-[0.65rem] opacity-70">{item.note}</span>
                        )}
                        <span className="sr-only">— {LEVEL_LABEL[item.level]}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              </Reveal>
            ))}
          </div>
        </div>
      </Section>
    </>
  );
}
