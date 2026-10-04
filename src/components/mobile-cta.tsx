"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight } from "lucide-react";

/**
 * Fixed "start a project" bar on small screens. Hidden on desktop and on the
 * contact and thank-you pages.
 */
const HIDDEN_ON = ["/contact", "/thank-you"];

export default function MobileCta() {
  const pathname = usePathname();
  if (HIDDEN_ON.includes(pathname)) return null;

  return (
    <div
      className={[
        "fixed inset-x-0 bottom-0 z-[3000] md:hidden print:hidden",
        // Only the button receives pointer events.
        "pointer-events-none",
        "px-4 pb-[calc(env(safe-area-inset-bottom,0px)+0.75rem)] pt-3",
        "bg-gradient-to-t from-background via-background/95 to-transparent",
      ].join(" ")}
    >
      <Link
        href="/contact"
        className="pointer-events-auto flex h-12 w-full items-center justify-center gap-2 rounded-full bg-brand px-6 text-sm font-medium text-brand-foreground shadow-lg shadow-brand/20 transition-transform active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        Start a project
        <ArrowRight aria-hidden className="h-4 w-4" />
      </Link>
    </div>
  );
}
