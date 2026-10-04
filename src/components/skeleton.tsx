import { cn } from "@/lib/utils";

/** Static placeholder block for loading.tsx files. */
export function Skeleton({ className }: { className?: string }) {
  return <div aria-hidden className={cn("rounded-md bg-foreground/[0.07]", className)} />;
}

/** Placeholder sized like PageHeader. */
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

/** Loading state shared by every loading.tsx, announced once to screen readers. */
export function LoadingShell({ children }: { children: React.ReactNode }) {
  return (
    <div role="status" aria-live="polite" aria-busy="true">
      <span className="sr-only">Loading</span>
      {children}
    </div>
  );
}
