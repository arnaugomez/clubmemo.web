import { CourseModel } from "@/src/core/courses/domain/models/course-model";
import { CourseDetailActionsDropdown } from "./course-detail-actions-dropdown";
import { CourseDetailEditSection } from "../../edit/components/edit-course-section";
import { CourseDetailEnrollSection } from "../../enroll/components/course-detail-enroll-section";

interface CourseDetailActionsSectionProps {
  course: CourseModel;
}

export async function CourseDetailActionsSection({
  course,
}: CourseDetailActionsSectionProps) {
  return (
    <div className="absolute bottom-4 right-4 flex space-x-2">
      {!course.isOwner && (
        <CourseDetailEnrollSection courseData={course.data} />
      )}
      {course.canEdit && <CourseDetailEditSection courseData={course.data} />}
      <CourseDetailActionsDropdown courseData={course.data} />
    </div>
  );
}
