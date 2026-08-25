"use client";

import { motion } from "motion/react";
import { about, experience, keycapList } from "@/data/portfolio";
import { Section, SectionHeader } from "@/components/section";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TechIcon from "@/components/tech-icon";
import { cn } from "@/lib/utils";
import type { Experience } from "@/types";

export default function ExperienceSection() {
  return (
    <Section id="experience" className="z-10 flex min-h-[120vh] flex-col items-center justify-center py-20">
      <div className="mx-auto w-full max-w-4xl px-4 md:px-8">
        <SectionHeader
          id="experience"
          title="Experience"
          desc="How I got here, and what I have actually been paid to do."
          spacer="mb-12 md:mb-20"
        />

        {/* Facts panel alongside the timeline. One role on its own left a very
            empty row; these are the details a client checks anyway. */}
        <div className="mb-10 grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {about.facts.map((fact) => (
            <div key={fact.label} className="bg-background/80 p-5 backdrop-blur-sm">
              <p className="eyebrow">{fact.label}</p>
              <p className="mt-1.5 text-sm leading-relaxed">{fact.value}</p>
            </div>
          ))}
        </div>

        <div className="relative flex flex-col gap-8 md:gap-12">
          {/* Connector rail */}
          <div className="absolute bottom-4 left-8 top-4 hidden w-px -translate-x-1/2 bg-border md:left-1/2 md:block" />

          {experience.map((item, i) => (
            <div key={item.id} className="relative">
              <ExperienceCard experience={item} index={i} />
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}

function ExperienceCard({ experience: exp, index }: { experience: Experience; index: number }) {
  // Only render the date pill when a real date exists — a placeholder dash
  // reads worse than no pill at all.
  const dates = [exp.startDate, exp.endDate].filter(Boolean).join(" – ");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1, ease: "easeOut" }}
      viewport={{ once: true, margin: "-50px" }}
    >
      <Card
        className={cn(
          "border-border bg-card text-card-foreground",
          "transition-colors duration-300 hover:border-brand/40",
          "shadow-sm hover:shadow-md"
        )}
      >
        <CardHeader className="pb-3">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
            <div className="space-y-1">
              <CardTitle className="text-xl font-bold tracking-tight">{exp.title}</CardTitle>
              <div className="text-base font-medium text-muted-foreground">{exp.company}</div>
            </div>
            {dates && (
              <Badge variant="secondary" className="w-fit font-mono text-xs font-normal">
                {dates}
              </Badge>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <ul className="ml-4 list-outside list-disc space-y-2 text-base leading-relaxed text-muted-foreground">
            {exp.description.map((point, i) => (
              <li key={i}>{point}</li>
            ))}
          </ul>

          {exp.skills.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {exp.skills.map((id) => {
                const cap = keycapList.find((c) => c.id === id);
                if (!cap) return null;
                return (
                  <Badge
                    key={id}
                    variant="outline"
                    className="gap-2 border-transparent bg-secondary/40 text-xs font-normal transition-colors hover:bg-secondary/70"
                  >
                    <TechIcon id={cap.id} className="opacity-90" />
                    {cap.label}
                  </Badge>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
