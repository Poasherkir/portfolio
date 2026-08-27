import { capabilities } from "@/data/portfolio";
import { Section, SectionHeader } from "@/components/section";
import { RevealGroup, RevealItem } from "@/components/reveal";
import Spotlight from "@/components/spotlight";

/** The same work as the stack section, framed as what a client is buying. */
export default function Capabilities() {
  return (
    <Section id="capabilities" className="py-24 md:py-32">
      <div className="container">
        <SectionHeader
          id="capabilities"
          title="What I can build"
          desc="Every line below names the project it can be checked against."
          spacer="mb-12 md:mb-16"
        />

        <Spotlight className="rounded-xl">
          <RevealGroup className="grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
            {capabilities.map((c) => (
              <RevealItem
                key={c.id}
                className="group/card relative bg-background/88 p-7 backdrop-blur-sm transition-colors duration-300 hover:bg-background/70"
              >
                <h3 className="font-display text-lg font-semibold tracking-tight transition-colors group-hover/card:text-brand">
                  {c.title}
                </h3>
                <p className="copy-halo mt-3 text-sm leading-relaxed text-muted-foreground">
                  {c.body}
                </p>
                <p className="mt-5 border-t border-border pt-4 font-mono text-[0.62rem] uppercase tracking-[0.14em] text-muted-foreground">
                  <span className="text-brand">Proven in</span> {c.proof}
                </p>
              </RevealItem>
            ))}
          </RevealGroup>
        </Spotlight>
      </div>
    </Section>
  );
}
