import { HeaderSkeleton, LoadingShell, Skeleton } from "@/components/skeleton";

export default function Loading() {
  return (
    <LoadingShell>
      <HeaderSkeleton />
      <div className="container py-16 md:py-24">
        <div className="max-w-xl space-y-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-11 w-full" />
          ))}
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    </LoadingShell>
  );
}
