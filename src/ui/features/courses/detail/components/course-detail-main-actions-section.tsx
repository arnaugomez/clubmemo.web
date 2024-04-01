import { CourseModel } from "@/src/core/courses/domain/models/course-model";
import { Button } from "@/src/ui/components/shadcn/ui/button";
import { CourseDetailEnrollSection } from "../../enroll/components/course-detail-enroll-section";

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
      {course.isEnrolled && <Button className="w-full">Practicar</Button>}
    </div>
  );
}
