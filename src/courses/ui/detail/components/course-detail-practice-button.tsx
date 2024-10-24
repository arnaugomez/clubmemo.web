import { Button } from "@/src/common/ui/components/shadcn/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/src/common/ui/components/shadcn/ui/tooltip";
import type { CourseModel } from "@/src/courses/domain/models/course-model";
import type { CoursePracticeCountModel } from "@/src/practice/domain/models/course-practice-count-model";
import Link from "next/link";
import { Suspense } from "react";
import { CourseDetailPracticeButtonLoading } from "./course-detail-practice-button-loading";
import { locator_practice_GetCoursePracticeCountUseCase } from "@/src/practice/locators/locator_get-course-practice-count-use-case";

interface CourseDetailPracticeButtonProps {
  course: CourseModel;
}

export function CourseDetailPracticeButton({
  course,
}: CourseDetailPracticeButtonProps) {
  return (
    <Suspense fallback={<CourseDetailPracticeButtonLoading />}>
      <CourseDetailPracticeButtonLoader course={course} />
    </Suspense>
  );
}

async function CourseDetailPracticeButtonLoader({
  course,
}: CourseDetailPracticeButtonProps) {
  if (!course.enrollment) return null;
  const useCase = locator_practice_GetCoursePracticeCountUseCase();
  const coursePracticeCount = await useCase.execute(course.enrollment);

  return (
    <CourseDetailPracticeButtonLoaded
      course={course}
      coursePracticeCount={coursePracticeCount}
    />
  );
}

interface CourseDetailPracticeButtonLoadedProps {
  course: CourseModel;
  coursePracticeCount: CoursePracticeCountModel;
}

export function CourseDetailPracticeButtonLoaded({
  course,
  coursePracticeCount,
}: CourseDetailPracticeButtonLoadedProps) {
  if (coursePracticeCount.shouldPractice) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger className="w-full">
            <Button className="w-full" asChild>
              <Link href={`/courses/detail/${course.id}/practice`}>
                Practicar
              </Link>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            Aprender: {coursePracticeCount.newCount} | Repasar:{" "}
            {coursePracticeCount.dueCount}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }
  return (
    <Button className="w-full" disabled>
      Práctica completada
    </Button>
  );
}
