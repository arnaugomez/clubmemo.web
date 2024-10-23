import type { CourseModel } from "@/src/courses/domain/models/course-model";
import { CourseDetailEnrollSection } from "../../enroll/components/course-detail-enroll-section";
import { CourseDetailPracticeButton } from "./course-detail-practice-button";
import { CourseDetailPracticeButtonLoading } from "./course-detail-practice-button-loading";

interface CourseDetailMainActionsSectionProps {
  course: CourseModel;
  isLoggedIn: boolean;
}

export function CourseDetailMainActionsSection({
  course,
  isLoggedIn,
}: CourseDetailMainActionsSectionProps) {
  if (course.isEnrolled) {
    return <CourseDetailPracticeButton course={course} />;
  } else if (!course.isOwner) {
    return (
      <CourseDetailEnrollSection
        courseData={course.data}
        isLoggedIn={isLoggedIn}
      />
    );
  }
  return <CourseDetailPracticeButtonLoading />;
}
