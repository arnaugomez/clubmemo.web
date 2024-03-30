import { CourseModel } from "@/src/core/courses/domain/models/course-model";
import { CourseDetailActionsDropdown } from "./course-detail-actions-dropdown";
import { CourseDetailEditSection } from "../../edit/components/edit-course-section";

interface CourseDetailActionsSectionProps {
  course: CourseModel;
}

export async function CourseDetailActionsSection({
  course,
}: CourseDetailActionsSectionProps) {
  return (
    <div className="absolute bottom-4 right-4 flex space-x-4">
      {course.canEdit && <CourseDetailEditSection courseData={course.data} />}
      <CourseDetailActionsDropdown courseData={course.data} />
    </div>
  );
}
