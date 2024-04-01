import { locator } from "@/src/core/app/locator";
import { textStyles } from "@/src/ui/styles/text-styles";
import { cn } from "@/src/ui/utils/shadcn";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { fetchMyProfile } from "../../../profile/fetch/fetch-my-profile";
import { CourseDetailActionsSection } from "./course-detail-actions-section";
import { CourseDetailAuthorsSection } from "./course-detail-authors-section";
import { CourseDetailMainActionsSection } from "./course-detail-main-actions-section";

interface CourseDetailMainSectionProps {
  id: string;
}

export async function CourseDetailMainSection({
  id,
}: CourseDetailMainSectionProps) {
  const profile = await fetchMyProfile();
  const coursesRepository = await locator.CoursesRepository();
  const course = await coursesRepository.getDetail({
    id,
    profileId: profile?.id,
  });
  if (!course || !course.canView) notFound();

  return (
    <>
      <div className="h-4" />
      <div className="px-4">
        <div className="relative bg-slate-200 rounded-xl h-40 sm:h-52 lg:h-64 overflow-hidden">
          {course.picture && <Image fill src={course.picture} alt="" />}
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
        <div className="h-12" />
        <CourseDetailMainActionsSection course={course} />
        <div className="h-6" />
      </div>
      <Suspense>
        <CourseDetailAuthorsSection course={course} />
      </Suspense>
    </>
  );
}
