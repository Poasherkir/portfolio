import Link from "next/link";
import {
  ArrowRight,
  Check,
  ChevronDown,
  Smartphone,
  Database,
  Workflow,
  LifeBuoy,
} from "lucide-react";
import { services } from "@/data/portfolio";
import { Section, SectionHeader } from "@/components/section";
import { RevealGroup, RevealItem } from "@/components/reveal";
import { Button } from "@/components/ui/button";
import type { Service } from "@/types";

const ICONS: Record<Service["icon"], typeof Smartphone> = {
  mobile: Smartphone,
  server: Database,
  automation: Workflow,
  rescue: LifeBuoy,
};

export default function Services() {
  return (
    <Section id="services" className="relative py-24 md:py-32">
      {/* Grid band, so the services block reads as its own surface. */}
      <div className="instrument-grid pointer-events-none absolute inset-0 opacity-50" />

      <div className="container relative">
        <SectionHeader
          id="services"
          title="Services"
          desc="Fixed scope, fixed price, fixed date. You end up owning something your team can run."
          spacer="mb-12 md:mb-20"
        />

        {/* Two columns, not three: there are four services, and a 3-wide grid
            strands the fourth card alone on its own row. */}
        <RevealGroup className="grid gap-6 md:grid-cols-2">
          {services.map((service) => {
            const Icon = ICONS[service.icon];
            return (
              <RevealItem
                key={service.id}
                className="flex h-full flex-col rounded-xl border border-border bg-card/85 p-7 backdrop-blur-sm transition-colors hover:border-brand/40"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-lg border border-brand/30 bg-brand/10 text-brand">
                  <Icon className="h-5 w-5" />
                </span>

                <h3 className="mt-6 font-display text-xl font-semibold tracking-tight">
                  {service.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {service.outcome}
                </p>

                {/* Collapsed by default. Four cards times five bullets is a
                    wall of text that nobody reads; native <details> keeps it
                    keyboard accessible and working before hydration. */}
                <details className="group/d mt-6 border-t border-border pt-6">
                  <summary className="-my-2 flex min-h-[44px] cursor-pointer list-none items-center justify-between gap-4 py-2 text-sm font-medium transition-colors hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background">
                    What&apos;s included
                    <ChevronDown
                      className="h-4 w-4 shrink-0 text-brand transition-transform duration-300 group-open/d:rotate-180"
                      aria-hidden
                    />
                  </summary>
                  <ul className="mt-5 space-y-2.5">
                    {service.includes.map((line) => (
                      <li key={line} className="flex gap-2.5 text-sm text-muted-foreground">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand" aria-hidden />
                        {line}
                      </li>
                    ))}
                  </ul>
                </details>

                <dl className="mt-6 space-y-3 border-t border-border pt-6">
                  <div className="flex items-baseline justify-between gap-4">
                    <dt className="eyebrow">Timeline</dt>
                    <dd className="text-sm">{service.timeline}</dd>
                  </div>
                  {/* Price line renders only once a real band is set — never a guess. */}
                  {service.priceBand && (
                    <div className="flex items-baseline justify-between gap-4">
                      <dt className="eyebrow">From</dt>
                      <dd className="text-sm font-semibold">{service.priceBand}</dd>
                    </div>
                  )}
                </dl>
              </RevealItem>
            );
          })}
        </RevealGroup>

        <div className="mt-10 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
          <Button asChild size="lg">
            <Link href="/contact">
              Tell me what you need
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <p className="text-sm text-muted-foreground">
            Not sure which one fits? Describe the problem and I will tell you.
          </p>
        </div>
      </div>
    </Section>
  );
}
