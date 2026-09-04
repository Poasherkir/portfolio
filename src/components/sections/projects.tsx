"use client";

import Link from "next/link";
import { ArrowUpRight, Github, Lock } from "lucide-react";
import { featuredProjects, keycapList, privateSource, projects } from "@/data/portfolio";
import { Section, SectionHeader } from "@/components/section";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalTrigger,
  useModal,
} from "@/components/ui/animated-modal";
import { FloatingDock, type DockItem } from "@/components/ui/floating-dock";
import ProjectVisual from "@/components/projects/project-visual";
import { Button } from "@/components/ui/button";
import type { Project } from "@/types";

const STATUS_LABEL: Record<Project["status"], string> = {
  production: "In production",
  active: "In development",
  archived: "Archived",
};

/** Maps a stack string onto a keycap so the dock reuses the same logos. */
function toDockItems(stack: string[]): DockItem[] {
  return stack.map((name) => {
    const cap = keycapList.find(
      (c) =>
        c.label.toLowerCase() === name.toLowerCase() ||
        c.label.toLowerCase().startsWith(name.toLowerCase())
    );
    return cap
      ? { id: cap.id, title: cap.label, hasIcon: true, color: cap.color }
      : { id: name, title: name, hasIcon: false, color: "currentColor" };
  });
}

export default function Projects() {
  return (
    <Section id="projects" className="mx-auto max-w-7xl pb-24 md:pb-32">
      <SectionHeader
        id="projects"
        title="Projects"
        // Counted from the data. Written out by hand it went stale the
        // moment a project was added or removed.
        desc={`${projects.length} shipped products, ${projects.filter((p) => p.hasCaseStudy).length} with full case studies.`}
      />

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {featuredProjects.map((project) => (
          <ProjectModal key={project.slug} project={project} />
        ))}
      </div>
    </Section>
  );
}

function ProjectModal({ project }: { project: Project }) {
  return (
    <div className="flex">
      <Modal>
        <ModalTrigger
          label={`Open case study for ${project.title}`}
          className="group/modal-btn block w-full bg-transparent text-left"
        >
          {/* Width comes from the grid column. The fixed pixel widths this
              replaced were narrower than the column on a wide screen, so the
              row of tiles never lined up with anything else on the page. */}
          <div
            className="relative w-full overflow-hidden rounded-lg border border-border"
            style={{ aspectRatio: "3/2" }}
          >
            <div className="absolute inset-0 transition-transform duration-500 ease-out group-hover/modal-btn:scale-[1.04]">
              <ProjectVisual project={project} />
            </div>

            {/* Reads over artwork of any brightness, so it stays black here
                rather than following the theme. */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/90 to-transparent pt-16">
              <div className="flex flex-col items-start gap-2 p-5">
                <span className="rounded bg-white/95 px-1.5 py-0.5 font-mono text-[0.58rem] uppercase tracking-[0.14em] text-black">
                  {STATUS_LABEL[project.status]}
                </span>
                <h3 className="text-left font-display text-lg font-semibold leading-tight text-white">
                  {project.title}
                </h3>
                {/* A title alone does not say what any of these are. One line
                    does, and it is the line already written for each. */}
                <p className="line-clamp-2 text-left text-[0.8rem] leading-snug text-white/70">
                  {project.valueProp}
                </p>
              </div>
            </div>
          </div>
        </ModalTrigger>

        <ModalBody className="overflow-auto md:max-h-[80%] md:max-w-4xl">
          <ModalContent>
            <ProjectDetail project={project} />
          </ModalContent>

          <ModalFooter className="gap-4">
            <CancelButton />
            {/* asChild throughout: a <button> inside an <a> is invalid HTML and
                browsers reparent it, which breaks keyboard activation. */}
            {project.links.live && (
              <Button asChild size="sm" className="w-28">
                <Link href={project.links.live} target="_blank" rel="noreferrer">
                  Visit
                </Link>
              </Button>
            )}
            {project.links.repo && (
              <Button asChild size="sm" variant="outline" className="w-28">
                <Link href={project.links.repo} target="_blank" rel="noreferrer">
                  <Github className="h-4 w-4" />
                  GitHub
                </Link>
              </Button>
            )}
            {project.hasCaseStudy && (
              <Button asChild size="sm" variant="outline" className="w-28">
                <Link href={`/projects/${project.slug}`}>
                  Full page
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </Button>
            )}
          </ModalFooter>
        </ModalBody>
      </Modal>
    </div>
  );
}

function CancelButton() {
  const { setOpen } = useModal();
  return (
    <Button size="sm" variant="secondary" className="w-28" onClick={() => setOpen(false)}>
      Cancel
    </Button>
  );
}

function ProjectDetail({ project }: { project: Project }) {
  const sections = [
    { key: "problem", label: "The problem", body: project.problem },
    { key: "approach", label: "The approach", body: project.approach },
    { key: "hardPart", label: "The hard part", body: project.hardPart },
    { key: "result", label: "The result", body: project.result },
  ].filter((s) => s.body.trim().length > 0);

  return (
    <>
      <h4 className="mb-2 text-center font-display text-lg font-bold text-neutral-600 dark:text-neutral-100 md:text-2xl">
        {project.title}
      </h4>
      <p className="mb-8 text-center text-sm text-muted-foreground">{project.tagline}</p>

      {project.stack.length > 0 && (
        <div className="mb-10 flex flex-col items-center gap-2">
          <FloatingDock items={toDockItems(project.stack)} />
          <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-500">Stack</p>
        </div>
      )}

      {project.privateRepo && !project.links.repo && (
        <div className="mb-8 rounded-lg border border-border p-4 text-center">
          <p className="flex items-center justify-center gap-2 text-sm font-medium">
            <Lock className="h-4 w-4 shrink-0 text-brand" />
            {privateSource.label}
          </p>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {privateSource.reason}
          </p>
        </div>
      )}

      <div className="space-y-8">
        {sections.map((s, i) => (
          <div key={s.key}>
            <p className="eyebrow">
              {String(i + 1).padStart(2, "0")} — {s.label}
            </p>
            <p className="mt-3 text-sm font-normal leading-relaxed text-muted-foreground md:text-base">
              {s.body}
            </p>
          </div>
        ))}
      </div>
    </>
  );
}
