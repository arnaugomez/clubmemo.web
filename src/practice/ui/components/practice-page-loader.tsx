import * as Effect from "effect/Effect";
import { runServer } from "@/src/common/effect/server-runtime";
import type { CourseEnrollmentModel } from "@/src/courses/domain/models/course-enrollment-model";
import type { CourseModel } from "@/src/courses/domain/models/course-model";
import { GetPracticeCardsUseCaseService } from "@/src/practice/layers/layer_get-practice-cards-use-case";
import { PracticeEmptyState } from "./practice-empty-state";
import { PracticeWizard } from "./practice-wizard";

interface PracticePageLoaderProps {
  course: CourseModel;
  enrollment: CourseEnrollmentModel;
}
export async function PracticePageLoader({
  course,
  enrollment,
}: PracticePageLoaderProps) {
  return runServer(
    Effect.gen(function* () {
      const useCase = yield* GetPracticeCardsUseCaseService;
      const cards = yield* useCase.execute({ course, enrollment });

      if (!cards.length) {
        return <PracticeEmptyState courseId={course.id} />;
      }
      return (
        <PracticeWizard
          courseData={course.data}
          enrollmentData={enrollment.data}
          cardsData={cards.map((c) => c.data)}
        />
      );
    }),
  );
}
