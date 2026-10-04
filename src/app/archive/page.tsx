import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, ExternalLink, Github } from "lucide-react";
import { projects } from "@/data/portfolio";
import PageHeader from "@/components/page-header";
import { Section } from "@/components/section";
import { FadeIn } from "@/components/reveal";
import ProjectStatus from "@/components/projects/project-status";

export const metadata: Metadata = {
  title: "Archive",
  description:
    "Every project Malik Boudine has built, in one list: year, what it is, what it is built with, and where to see it.",
  alternates: { canonical: "/archive" },
};

const linkClass =
  "inline-flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-foreground/[0.06] hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

export default function ArchivePage() {
  return (
    <>
      <PageHeader
        eyebrow="Archive"
        title="Every project, in one list."
        lead="Year, what it is, what it is built with, and where to see it. The case studies have the detail."
      />

      <Section className="py-14 md:py-20">
        <div className="container">
          <FadeIn delay={0.2}>
            <div className="overflow-x-auto rounded-xl border border-border bg-background/90">
              <table className="w-full border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-border bg-secondary/30">
                    <th scope="col" className="eyebrow hidden px-4 py-3 font-medium sm:table-cell">
                      Year
                    </th>
                    <th scope="col" className="eyebrow px-4 py-3 font-medium">
                      Project
                    </th>
                    <th scope="col" className="eyebrow hidden px-4 py-3 font-medium md:table-cell">
                      Type
                    </th>
                    <th scope="col" className="eyebrow hidden px-4 py-3 font-medium lg:table-cell">
                      Built with
                    </th>
                    <th scope="col" className="eyebrow hidden px-4 py-3 font-medium sm:table-cell">
                      Status
                    </th>
                    <th scope="col" className="eyebrow px-4 py-3 text-right font-medium">
                      <span className="sr-only">Links</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map((p) => (
                    <tr
                      key={p.slug}
                      className="border-b border-border align-top transition-colors last:border-0 hover:bg-foreground/[0.03]"
                    >
                      <td className="hidden whitespace-nowrap px-4 py-4 font-mono text-xs text-muted-foreground sm:table-cell">
                        {p.year}
                      </td>
                      <td className="px-4 py-4">
                        <div className="mb-1.5 flex items-center gap-3 sm:hidden">
                          <span className="font-mono text-[0.65rem] text-muted-foreground">
                            {p.year}
                          </span>
                          <ProjectStatus status={p.status} />
                        </div>
                        {p.hasCaseStudy ? (
                          <Link
                            href={`/projects/${p.slug}`}
                            className="font-display text-base font-semibold tracking-tight transition-colors hover:text-brand"
                          >
                            {p.title}
                          </Link>
                        ) : (
                          <span className="font-display text-base font-semibold tracking-tight">
                            {p.title}
                          </span>
                        )}
                        <p className="mt-1 max-w-md text-sm leading-relaxed text-muted-foreground">
                          {p.valueProp}
                        </p>
                      </td>
                      <td className="hidden whitespace-nowrap px-4 py-4 font-mono text-[0.68rem] uppercase tracking-[0.12em] text-foreground/60 md:table-cell">
                        {p.tags.join(" · ")}
                      </td>
                      <td className="hidden max-w-xs px-4 py-4 font-mono text-xs leading-relaxed text-muted-foreground lg:table-cell">
                        {p.stack.length > 0 ? p.stack.join(" · ") : "—"}
                      </td>
                      <td className="hidden whitespace-nowrap px-4 py-4 sm:table-cell">
                        <ProjectStatus status={p.status} />
                      </td>
                      <td className="px-2 py-3 sm:px-3">
                        <div className="flex flex-col items-end gap-0.5 sm:flex-row sm:items-center sm:justify-end">
                          {p.hasCaseStudy && (
                            <Link
                              href={`/projects/${p.slug}`}
                              aria-label={`${p.title} case study`}
                              className={linkClass}
                            >
                              <ArrowUpRight className="h-4 w-4" />
                            </Link>
                          )}
                          {p.links.live && (
                            <a
                              href={p.links.live}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label={`${p.title}, live`}
                              className={linkClass}
                            >
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          )}
                          {p.links.repo && (
                            <a
                              href={p.links.repo}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label={`${p.title} source on GitHub`}
                              className={linkClass}
                            >
                              <Github className="h-4 w-4" />
                            </a>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </FadeIn>

          <p className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-[0.65rem] uppercase tracking-[0.14em] text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <ArrowUpRight className="h-3.5 w-3.5" aria-hidden /> Case study
            </span>
            <span className="inline-flex items-center gap-1.5">
              <ExternalLink className="h-3.5 w-3.5" aria-hidden /> Live
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Github className="h-3.5 w-3.5" aria-hidden /> Source
            </span>
          </p>
        </div>
      </Section>
    </>
  );
}
