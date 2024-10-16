import type { CourseEnrollmentModel } from "@/src/courses/domain/models/course-enrollment-model";
import type { CourseModel } from "@/src/courses/domain/models/course-model";
import { PracticeEmptyState } from "./practice-empty-state";
import { PracticeWizard } from "./practice-wizard";
import { locator_practice_GetPracticeCardsUseCase } from "../../locators/locator_get-practice-cards-use-case";

interface PracticePageLoaderProps {
  course: CourseModel;
  enrollment: CourseEnrollmentModel;
}
export async function PracticePageLoader({
  course,
  enrollment,
}: PracticePageLoaderProps) {
  const useCase = locator_practice_GetPracticeCardsUseCase();
  const cards = await useCase.execute({ course, enrollment });

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
}
