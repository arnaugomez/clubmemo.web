import { Skeleton } from "@/src/common/ui/components/shadcn/ui/skeleton";

/**
 * Shows a loading state while discover page content is loading
 */
export function DiscoverLoadingSkeletons() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
      <Skeleton className="h-48 rounded-lg" />
      <Skeleton className="h-48 rounded-lg" />
      <Skeleton className="h-48 rounded-lg" />
      <Skeleton className="hidden h-48 rounded-lg sm:block" />
      <Skeleton className="hidden h-48 rounded-lg md:block" />
      <Skeleton className="hidden h-48 rounded-lg md:block" />
    </div>
  );
}
