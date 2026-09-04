import { HeaderSkeleton, LoadingShell, Skeleton } from "@/components/skeleton";

export default function Loading() {
  return (
    <LoadingShell>
      <HeaderSkeleton />
      <div className="container py-16 md:py-24">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="aspect-[3/2] w-full" />
          ))}
        </div>
      </div>
    </LoadingShell>
  );
}
