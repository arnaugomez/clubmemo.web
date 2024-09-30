import { textStyles } from "@/src/common/ui/styles/text-styles";
import { cn } from "@/src/common/ui/utils/shadcn";
import type { CourseModel } from "@/src/courses/domain/models/course-model";
import Image from "next/image";
import { Suspense } from "react";
import { TagsSection } from "../../../../tags/ui/components/tags-section";
import { CourseDetailActionsSection } from "./course-detail-actions-section";
import { CourseDetailAuthorsSectionLoader } from "./course-detail-authors-section";
import { CourseDetailMainActionsSection } from "./course-detail-main-actions-section";

interface CourseDetailMainSectionProps {
  course: CourseModel;
}

export async function CourseDetailMainSection({
  course,
}: CourseDetailMainSectionProps) {
  return (
    <>
      <div className="h-4" />
      <div className="px-4">
        <div className="relative h-40 overflow-hidden rounded-xl bg-slate-200 sm:h-52 lg:h-64">
          {course.picture && (
            <Image fill src={course.picture} alt="" className="object-cover" />
          )}
          <CourseDetailActionsSection course={course} />
        </div>
        <div className="h-4" />
        <p className={textStyles.muted}>
          {course.isPublic ? "Curso público" : "Curso privado"}
        </p>
        <div className="h-2" />
        <h1 className={textStyles.h2}>{course.name}</h1>
        <div className="h-4" />
        <p className={cn(textStyles.p, "whitespace-pre-line")}>
          {course.description || "Este curso no tiene descripción"}
        </p>
        <TagsSection tags={course.tags} variant="secondary" />
        <div className="h-12" />
        <CourseDetailMainActionsSection course={course} />
        <div className="h-6" />
      </div>
      <Suspense>
        <CourseDetailAuthorsSectionLoader course={course} />
      </Suspense>
    </>
  );
}
