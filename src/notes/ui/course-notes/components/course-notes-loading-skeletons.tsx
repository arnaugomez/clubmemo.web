import { Skeleton } from "@/src/common/ui/components/shadcn/ui/skeleton";
import range from "lodash/range";

export function CourseNotesLoadingSkeletons() {
  return (
    <div className="grid grid-cols-1 gap-4">
      {range(3).map((element) => (
        <Skeleton
          data-testid="CourseNotesLoadingSkeletons__skeleton"
          key={element}
          className="h-32 w-full rounded-lg bg-slate-200"
        />
      ))}
    </div>
  );
}
