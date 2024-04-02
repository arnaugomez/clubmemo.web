import { Skeleton } from "@/src/ui/components/shadcn/ui/skeleton";

export function DiscoverLoadingSkeletons() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      <Skeleton className="h-48 rounded-lg" />
      <Skeleton className="h-48 rounded-lg" />
      <Skeleton className="h-48 rounded-lg" />
      <Skeleton className="h-48 hidden sm:block rounded-lg" />
      <Skeleton className="h-48 hidden md:block rounded-lg" />
      <Skeleton className="h-48 hidden md:block rounded-lg" />
    </div>
  );
}
