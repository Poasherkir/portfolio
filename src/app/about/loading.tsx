import { HeaderSkeleton, LoadingShell, Skeleton } from "@/components/skeleton";

export default function Loading() {
  return (
    <LoadingShell>
      <HeaderSkeleton />
      <div className="container py-16 md:py-24">
        <div className="max-w-2xl space-y-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-5 w-full last:w-1/2" />
          ))}
        </div>
      </div>
    </LoadingShell>
  );
}
