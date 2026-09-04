import { cn } from "@/lib/utils";

/**
 * Placeholder block for route-level loading files.
 *
 * Deliberately not a shimmer: a moving highlight on a page that resolves in
 * under a second reads as jank rather than progress. A steady block that
 * matches the shape of what is coming does the job and disappears quietly.
 */
export function Skeleton({ className }: { className?: string }) {
  return <div aria-hidden className={cn("rounded-md bg-foreground/[0.07]", className)} />;
}

/** Masthead placeholder, sized to the real PageHeader so nothing jumps. */
export function HeaderSkeleton() {
  return (
    <header className="relative border-b border-border pb-14 pt-36 md:pb-20 md:pt-44">
      <div className="container">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="mt-6 h-12 w-full max-w-3xl md:h-16" />
        <Skeleton className="mt-4 h-12 w-2/3 max-w-xl md:h-16" />
        <Skeleton className="mt-8 h-5 w-full max-w-lg" />
      </div>
    </header>
  );
}

/**
 * Every loading.tsx renders this. Screen readers get one polite announcement
 * instead of a page of meaningless boxes.
 */
export function LoadingShell({ children }: { children: React.ReactNode }) {
  return (
    <div role="status" aria-live="polite" aria-busy="true">
      <span className="sr-only">Loading</span>
      {children}
    </div>
  );
}
