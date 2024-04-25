import { CourseModel } from "@/src/courses/domain/models/course-model";
import { CourseDetailEditSection } from "../../edit/components/edit-course-section";
import { CourseDetailActionsDropdown } from "./course-detail-actions-dropdown";

interface CourseDetailActionsSectionProps {
  course: CourseModel;
}

export async function CourseDetailActionsSection({
  course,
}: CourseDetailActionsSectionProps) {
  return (
    <div className="absolute bottom-4 right-4 flex space-x-2">
      {course.canEdit && <CourseDetailEditSection courseData={course.data} />}
      <CourseDetailActionsDropdown courseData={course.data} />
    </div>
  );
}
