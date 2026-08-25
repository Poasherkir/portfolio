import { headlineStats } from "@/data/portfolio";
import { Section } from "@/components/section";
import { RevealGroup, RevealItem } from "@/components/reveal";

/**
 * Headline numbers. Every figure is derived from the project data or lifted
 * straight from a project README — nothing estimated.
 */
export default function Stats() {
  return (
    <Section className="py-16 md:py-24">
      <div className="container">
        <RevealGroup className="grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
          {headlineStats.map((stat) => (
            <RevealItem key={stat.label} className="bg-background/80 p-7 backdrop-blur-sm">
              <p className="font-display text-5xl font-bold tracking-tight text-brand">
                {stat.value}
              </p>
              <p className="mt-3 font-display text-base font-semibold">{stat.label}</p>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{stat.note}</p>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </Section>
  );
}
