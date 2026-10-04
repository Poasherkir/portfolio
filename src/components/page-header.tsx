import type { ReactNode } from "react";
import { FadeIn } from "./reveal";

/** Masthead for the inner pages. */
export default function PageHeader({
  eyebrow,
  title,
  lead,
  children,
}: {
  eyebrow: string;
  title: string;
  lead?: string;
  children?: ReactNode;
}) {
  return (
    <header className="relative border-b border-border pb-14 pt-36 md:pb-20 md:pt-44">
      <div className="container">
        <FadeIn>
          <p className="eyebrow">{eyebrow}</p>
        </FadeIn>
        <FadeIn delay={0.08}>
          <h1 className="mt-4 max-w-4xl font-display text-display-md font-semibold tracking-tighter text-balance">
            {title}
          </h1>
        </FadeIn>
        {lead && (
          <FadeIn delay={0.16}>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">{lead}</p>
          </FadeIn>
        )}
        {children && (
          <FadeIn delay={0.24}>
            <div className="mt-8">{children}</div>
          </FadeIn>
        )}
      </div>
    </header>
  );
}
