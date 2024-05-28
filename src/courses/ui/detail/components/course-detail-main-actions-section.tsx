import type { CourseModel } from "@/src/courses/domain/models/course-model";
import { CourseDetailEnrollSection } from "../../enroll/components/course-detail-enroll-section";
import { CourseDetailPracticeButton } from "./course-detail-practice-button";

interface CourseDetailMainActionsSectionProps {
  course: CourseModel;
}

export function CourseDetailMainActionsSection({
  course,
}: CourseDetailMainActionsSectionProps) {
  return (
    <div className="min-h-10">
      {!course.isOwner && (
        <CourseDetailEnrollSection
          key={course.isEnrolled.toString()}
          courseData={course.data}
        />
      )}
      {course.isEnrolled && <CourseDetailPracticeButton course={course} />}
    </div>
  );
}
