import { HeaderSkeleton, LoadingShell, Skeleton } from "@/components/skeleton";

export default function Loading() {
  return (
    <LoadingShell>
      <HeaderSkeleton />
      <div className="container py-16 md:py-24">
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 28 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-28 rounded-full" />
          ))}
        </div>
      </div>
    </LoadingShell>
  );
}
