import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { foundations, skillGroups } from "@/data/portfolio";
import { Section } from "@/components/section";
import { Reveal, RevealGroup, RevealItem, WipeReveal } from "@/components/reveal";

/**
 * A technical inventory rather than a logo wall. The 3D board flies into the
 * stage below and is the playful way in; this is the version you can read.
 */
export default function Skills() {
  return (
    <Section id="skills" className="py-section">
      <div className="container">
        <div className="pointer-events-none">
          <WipeReveal>
            <p className="eyebrow">System capabilities</p>
          </WipeReveal>
          <Reveal delay={0.05}>
            <h2 className="heading-halo mt-5 max-w-3xl font-display text-display-lg">
              The stack behind the products.
            </h2>
          </Reveal>
        </div>

        {/* Clear space the board flies into. */}
        <div
          className="pointer-events-none h-[42vh] md:h-[56vh]"
          data-kbd-anchor="skills"
          aria-hidden
        />

        <RevealGroup className="border-t border-border">
          {skillGroups.map((group, i) => (
            <RevealItem
              key={group.title}
              className="group grid grid-cols-1 gap-x-10 gap-y-3 border-b border-border py-7 md:grid-cols-[5rem_14rem_minmax(0,1fr)] md:py-9"
            >
              {/* The number is the only place the accent appears in this list. */}
              <span className="font-mono text-meta uppercase text-brand">
                {String(i + 1).padStart(2, "0")}
              </span>

              <div>
                <h3 className="font-display text-display-sm leading-tight transition-transform duration-500 ease-out md:group-hover:translate-x-1">
                  {group.title}
                </h3>
                <span className="mt-1.5 block font-mono text-meta uppercase text-muted-foreground/70">
                  {group.items.length} tools
                </span>
              </div>

              <div>
                <p className="text-body text-muted-foreground">{group.blurb}</p>
                <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
                  {group.items.map((item) => (
                    <li
                      key={item.name}
                      className="flex items-center gap-x-5 font-mono text-[0.78rem] tracking-tight text-foreground/75"
                    >
                      {item.name}
                      <span aria-hidden className="h-3 w-px bg-border last:hidden" />
                    </li>
                  ))}
                </ul>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>

        <Reveal delay={0.08}>
          <div className="mt-10 flex flex-wrap items-baseline justify-between gap-6">
            <p className="max-w-xl font-mono text-[0.78rem] leading-relaxed text-muted-foreground">
              {foundations}
            </p>
            <Link
              href="/stack"
              className="group inline-flex items-center gap-2 border-b border-foreground/25 pb-1 text-sm font-medium transition-colors hover:border-brand hover:text-brand"
            >
              Full stack breakdown
              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
