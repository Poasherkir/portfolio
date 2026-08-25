import type { Metadata } from "next";
import { funProjects, privateSource, projects } from "@/data/portfolio";
import PageHeader from "@/components/page-header";
import ProjectGrid from "@/components/projects/project-grid";
import { Section } from "@/components/section";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Production mobile and web work: an Electronic Flight Bag for commercial aviation, an exam-prep platform with its own payment gating, PDF automation pipelines, and more.",
  alternates: { canonical: "/projects" },
};

export default function ProjectsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Work"
        title="Everything I have shipped that is worth showing you."
        lead={`Filter by what it is. The top three have full case studies — problem, approach, the part that was actually hard, and the result. ${privateSource.reason}`}
      />

      <Section className="py-14 md:py-20">
        <div className="container">
          <ProjectGrid projects={projects} />

          {funProjects.length > 0 && (
            <div className="mt-20 border-t border-border pt-10">
              <p className="eyebrow">Also on the shelf</p>
              <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
                {funProjects.map((p) => (
                  <li key={p.name} className="text-sm text-muted-foreground">
                    {p.url ? (
                      <a
                        href={p.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono text-foreground transition-colors hover:text-brand"
                      >
                        {p.name}
                      </a>
                    ) : (
                      <span className="font-mono text-foreground">{p.name}</span>
                    )}
                    <span className="ml-2">{p.note}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </Section>
    </>
  );
}
