import { deliveryProcess } from "@/data/portfolio";
import { Section, SectionHeader } from "@/components/section";
import { RevealGroup, RevealItem } from "@/components/reveal";

/** All six steps, so deployment and handover are visibly covered. */
export default function Process() {
  return (
    <Section id="process" className="py-24 md:py-32">
      <div className="container">
        <SectionHeader
          id="process"
          title="How I work"
          desc="Six steps, and you review the work at every milestone."
          spacer="mb-12 md:mb-16"
        />

        <RevealGroup className="grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {deliveryProcess.map((stage) => (
            <RevealItem key={stage.step} className="bg-background/88 p-7 backdrop-blur-sm">
              <span className="font-mono text-xs text-brand">{stage.step}</span>
              <h3 className="mt-3 font-display text-lg font-semibold tracking-tight">
                {stage.title}
              </h3>
              <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">{stage.body}</p>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </Section>
  );
}
