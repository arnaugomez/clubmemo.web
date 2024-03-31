import { CourseDetailMainSection } from "@/src/ui/features/courses/detail/components/course-detail-main-section";
import { invalidIdGuard } from "@/src/ui/guards/invalid-id-guard";
import { textStyles } from "@/src/ui/styles/text-styles";
import { cn } from "@/src/ui/utils/shadcn";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

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
      {/* TODO: create course detail cards section component */}
      <div className="flex-1 min-w-0 bg-slate-100 md:overflow-y-auto">
        <div className="h-16"></div>
        <div className="px-4">
          <div className="mx-auto max-w-prose">
            <h2 className={cn(textStyles.h2, "text-slate-700")}>
              Tarjetas de aprendizaje
            </h2>

            {/* TODO: Extract arrow link component. link addrress is missing. */}
            <Link
              href="/"
              className={cn(textStyles.mutedLink, "space-x-1 pt-1")}
            >
              <span>Ver todas</span>

              <ArrowRight size={16} className="inline" />
            </Link>
          </div>
        </div>
        <div className="h-16"></div>
      </div>
    </div>
  );
}
