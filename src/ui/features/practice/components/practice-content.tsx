import { CourseEnrollmentModel } from "@/src/core/courses/domain/models/course-enrollment-model";
import { CourseModel } from "@/src/core/courses/domain/models/course-model";
import { fetchPracticeCards } from "../fetch/fetch-practice-cards";
import { PracticeEmptyState } from "./practice-empty-state";
import { PracticeWizard } from "./practice-wizard";

interface PracticeContentProps {
  course: CourseModel;
  enrollment: CourseEnrollmentModel;
}
// TODO: extract use case class
export async function PracticeContent({
  course,
  enrollment,
}: PracticeContentProps) {
  const cards = await fetchPracticeCards({ course, enrollment });

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
