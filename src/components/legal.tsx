import { Reveal } from "./reveal";

/**
 * Shared body for /privacy and /terms so the two read as one document set
 * rather than two pages that happened to be written on different days.
 */
export type LegalSection = {
  heading: string;
  paragraphs: string[];
  list?: string[];
};

/** Single source for the date both legal pages stamp themselves with. */
export const LEGAL_UPDATED = "September 2026";

export function LegalBody({ sections }: { sections: LegalSection[] }) {
  return (
    <div className="max-w-2xl">
      {sections.map((section, i) => (
        <Reveal key={section.heading} delay={Math.min(i * 0.03, 0.2)}>
          <section className="mt-12 first:mt-0">
            <h2 className="font-display text-xl font-semibold tracking-tight md:text-2xl">
              {section.heading}
            </h2>

            {section.paragraphs.map((para, j) => (
              <p key={j} className="mt-4 text-base leading-relaxed text-muted-foreground">
                {para}
              </p>
            ))}

            {section.list && (
              <ul className="mt-4 space-y-3">
                {section.list.map((item, j) => (
                  <li
                    key={j}
                    className="relative pl-5 text-base leading-relaxed text-muted-foreground before:absolute before:left-0 before:top-[0.65em] before:h-1 before:w-1 before:rounded-full before:bg-brand"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </section>
        </Reveal>
      ))}
    </div>
  );
}
