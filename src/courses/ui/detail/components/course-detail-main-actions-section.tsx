import type { CourseModel } from "@/src/courses/domain/models/course-model";
import { CourseDetailEnrollSection } from "../../enroll/components/course-detail-enroll-section";
import { CourseDetailPracticeButton } from "./course-detail-practice-button";
import { CourseDetailPracticeButtonLoading } from "./course-detail-practice-button-loading";

interface CourseDetailMainActionsSectionProps {
  course: CourseModel;
}

export function CourseDetailMainActionsSection({
  course,
}: CourseDetailMainActionsSectionProps) {
  if (course.isEnrolled) {
    return <CourseDetailPracticeButton course={course} />;
  } else if (!course.isOwner) {
    return <CourseDetailEnrollSection courseData={course.data} />;
  }
  return <CourseDetailPracticeButtonLoading />;
}
