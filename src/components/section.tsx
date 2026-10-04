import type { ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Reveal, WipeReveal } from "./reveal";

export function Section({
  id,
  className,
  children,
}: {
  id?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className={cn("relative scroll-mt-24", className)}>
      {children}
    </section>
  );
}

/** Centred section title. */
export function SectionHeader({
  id,
  eyebrow,
  title,
  desc,
  sticky = false,
  spacer = "mb-12 md:mb-16",
  className,
}: {
  id?: string;
  eyebrow?: string;
  title: ReactNode;
  desc?: string;
  sticky?: boolean;
  spacer?: string;
  className?: string;
}) {
  const heading = (
    // heading-halo keeps the title readable over the 3D board.
    <h2 className="heading-halo text-center font-display text-4xl font-bold text-foreground md:text-7xl">
      {title}
    </h2>
  );

  return (
    <div className={cn(sticky && "sticky top-[70px]", spacer, className)}>
      {eyebrow && (
        <WipeReveal className="mx-auto">
          <p className="eyebrow text-center">{eyebrow}</p>
        </WipeReveal>
      )}

      <WipeReveal width="100%" delay={0.05}>
        {id ? (
          <Link href={`#${id}`} aria-label={typeof title === "string" ? title : undefined}>
            {heading}
          </Link>
        ) : (
          heading
        )}
      </WipeReveal>

      {desc && (
        <Reveal delay={0.12}>
          <p className="heading-halo mx-auto mt-4 max-w-3xl text-center text-base font-normal text-muted-foreground">
            {desc}
          </p>
        </Reveal>
      )}
    </div>
  );
}
