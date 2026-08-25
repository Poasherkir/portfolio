import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { foundations, skillGroups } from "@/data/portfolio";
import { Section, SectionHeader } from "@/components/section";
import { Reveal, RevealGroup, RevealItem } from "@/components/reveal";

/**
 * The 3D keyboard flies into the empty stage in the middle of this section and
 * is the headline. The written list underneath is deliberately short — the
 * board is the fun way in, /stack is the exhaustive answer, and a second wall
 * of text here would just be the same information twice.
 */
export default function Skills() {
  return (
    <Section id="skills" className="pb-24 pt-24 md:pb-32 md:pt-32">
      {/* Header and stage are click-through, so the board behind them stays
          hoverable. Nothing in here is interactive anyway. */}
      <div className="container pointer-events-none">
        <SectionHeader
          id="skills"
          title="Tech Stack"
          desc="Every keycap is something on this page — no filler logos for technologies I do not use. Hover one, or just press a key."
        />
      </div>

      {/* Clear space the keyboard flies into, and the element the choreography
          actually keys off — see measureAnchors. */}
      <div
        data-kbd-anchor="skills"
        className="pointer-events-none h-[46vh] md:h-[60vh]"
        aria-hidden
      />

      <div className="container">
        <RevealGroup className="grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
          {skillGroups.map((group) => (
            <RevealItem key={group.title} className="bg-background/80 p-6 backdrop-blur-md">
              <h3 className="eyebrow">{group.title}</h3>
              <ul className="mt-4 space-y-2">
                {/* Top four only. The full matrix lives on /stack — repeating
                    all thirty here is what made this section a wall. */}
                {group.items.slice(0, 4).map((item) => (
                  <li key={item.name} className="text-sm font-medium leading-snug">
                    {item.name}
                  </li>
                ))}
              </ul>
              {group.items.length > 4 && (
                <p className="mt-3 font-mono text-xs text-muted-foreground">
                  +{group.items.length - 4} more
                </p>
              )}
            </RevealItem>
          ))}
        </RevealGroup>

        <Reveal delay={0.1}>
          <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
            <p className="max-w-xl font-mono text-xs leading-relaxed text-muted-foreground">
              {foundations}
            </p>
            <Link
              href="/stack"
              className="group inline-flex shrink-0 items-center gap-2 text-sm font-medium text-brand transition-colors hover:text-brand/80"
            >
              See the full stack
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
