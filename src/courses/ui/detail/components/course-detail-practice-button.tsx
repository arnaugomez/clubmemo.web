import { Button } from "@/src/common/ui/components/shadcn/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/src/common/ui/components/shadcn/ui/tooltip";
import type { CourseModel } from "@/src/courses/domain/models/course-model";
import type { CoursePracticeCountModel } from "@/src/practice/domain/models/course-practice-count-model";
import { practiceLocator } from "@/src/practice/practice-locator";
import Link from "next/link";
import { Suspense } from "react";

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

export function CourseDetailPracticeButtonLoading() {
  return (
    <Button className="w-full" disabled>
      Cargando práctica...
    </Button>
  );
}

async function CourseDetailPracticeButtonLoader({
  course,
}: CourseDetailPracticeButtonProps) {
  if (!course.enrollment) return null;
  const useCase = await practiceLocator.GetCoursePracticeCountUseCase();
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
            Nuevo: {coursePracticeCount.newCount} | Repasar:{" "}
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
