import { CourseDetailMainSection } from "@/src/ui/features/courses/detail/components/course-detail-main-section";
import { CourseNotesSection } from "@/src/ui/features/notes/course-notes/components/course-notes-section";
import { invalidIdGuard } from "@/src/ui/guards/invalid-id-guard";

export default function CourseDetailPage({
  params: { id },
}: {
  // TODO: create reusable type for id params
  params: { id: string };
}) {
  invalidIdGuard(id);
  return (
    <div className="size-full overflow-y-auto md:overflow-y-visible md:flex md:items-stretch md:divide-x-[1px] divide-slate-200">
      <div className="flex-none w-full md:max-w-sm lg:max-w-md xl:max-w-lg md:overflow-y-auto">
        <CourseDetailMainSection id={id} />
      </div>
      <div className="flex-1 min-w-0 bg-slate-100 md:overflow-y-auto">
        <CourseNotesSection courseId={id} />
      </div>
    </div>
  );
}
