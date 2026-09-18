import * as Effect from "effect/Effect";
import Link from "next/link";
import { Suspense } from "react";
import { runServer } from "@/src/common/effect/server-runtime";
import { Button } from "@/src/common/ui/components/shadcn/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/src/common/ui/components/shadcn/ui/tooltip";
import type { CourseModel } from "@/src/courses/domain/models/course-model";
import type { CoursePracticeCountModel } from "@/src/practice/domain/models/course-practice-count-model";
import { GetCoursePracticeCountUseCaseService } from "@/src/practice/layers/layer_get-course-practice-count-use-case";
import { CourseDetailPracticeButtonLoading } from "./course-detail-practice-button-loading";

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
  return runServer(
    Effect.gen(function* () {
      if (!course.enrollment) return null;
      const useCase = yield* GetCoursePracticeCountUseCaseService;
      const coursePracticeCount = yield* useCase.execute(course.enrollment);

      return (
        <CourseDetailPracticeButtonLoaded
          course={course}
          coursePracticeCount={coursePracticeCount}
        />
      );
    }),
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
