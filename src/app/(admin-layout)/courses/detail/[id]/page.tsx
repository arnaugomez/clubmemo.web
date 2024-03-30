import { CourseDetailMainSection } from "@/src/ui/features/courses/detail/components/course-detail-main-section";

export default function CourseDetailPage({
  params: { id },
}: {
  // TODO: create reusable type for id params
  params: { id: string };
}) {
  return (
    <div className="size-full overflow-y-auto md:overflow-y-hidden md:flex md:divide-x-[1px] divide-slate-200">
      <div className="flex-none w-full md:max-w-sm lg:max-w-md xl:max-w-lg md:overflow-y-auto">
        <CourseDetailMainSection id={id} />
        course {id}
      </div>
      <div className="flex-1 bg-slate-100 md:overflow-y-auto"></div>
    </div>
  );
}
