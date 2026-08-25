import type { ReactNode } from "react";
import { BlurIn } from "./reveal";

/** Shared masthead for the inner pages, so /projects, /about and /contact rhyme. */
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
        <BlurIn>
          <p className="eyebrow">{eyebrow}</p>
        </BlurIn>
        <BlurIn delay={0.08}>
          <h1 className="mt-4 max-w-4xl font-display text-display-md font-semibold tracking-tighter text-balance">
            {title}
          </h1>
        </BlurIn>
        {lead && (
          <BlurIn delay={0.16}>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">{lead}</p>
          </BlurIn>
        )}
        {children && (
          <BlurIn delay={0.24}>
            <div className="mt-8">{children}</div>
          </BlurIn>
        )}
      </div>
    </header>
  );
}
