import { Skeleton } from "@/src/ui/components/shadcn/ui/skeleton";

export function CourseNotesLoadingSkeletons() {
  return (
    <div className="grid grid-cols-1 gap-4">
      {Array.from({ length: 3 }).map((_, index) => (
        <Skeleton key={index} className="h-32 w-full rounded-lg bg-slate-200" />
      ))}
    </div>
  );
}
