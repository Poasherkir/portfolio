import { faq } from "@/data/portfolio";
import { Section, SectionHeader } from "@/components/section";
import { Reveal } from "@/components/reveal";

/**
 * Native <details>, not a JS accordion. It works before hydration, it is
 * keyboard accessible and screen-reader correct for free, and browsers can
 * find text inside a collapsed one.
 */
export default function Faq() {
  return (
    <Section id="faq" className="py-24 md:py-32">
      <div className="container">
        <SectionHeader
          id="faq"
          title="Questions"
          desc="The things people ask before starting a project."
          spacer="mb-12 md:mb-16"
        />

        <div className="mx-auto max-w-3xl divide-y divide-border border-y border-border">
          {faq.map((item, i) => (
            <Reveal key={item.q} delay={i * 0.04}>
              <details className="group">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-left">
                  <span className="font-display text-base font-semibold tracking-tight md:text-lg">
                    {item.q}
                  </span>
                  <span
                    aria-hidden
                    className="relative h-4 w-4 shrink-0 text-brand transition-transform duration-300 group-open:rotate-45"
                  >
                    <span className="absolute left-0 top-1/2 h-px w-4 -translate-y-1/2 bg-current" />
                    <span className="absolute left-1/2 top-0 h-4 w-px -translate-x-1/2 bg-current" />
                  </span>
                </summary>
                <p className="max-w-2xl pb-6 text-sm leading-relaxed text-muted-foreground md:text-base">
                  {item.a}
                </p>
              </details>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}
