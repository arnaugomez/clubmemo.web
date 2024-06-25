import type { CourseEnrollmentModel } from "@/src/courses/domain/models/course-enrollment-model";
import type { CourseModel } from "@/src/courses/domain/models/course-model";
import { practiceLocator } from "../../practice-locator";
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
  const useCase = await practiceLocator.GetPracticeCardsUseCase();
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
