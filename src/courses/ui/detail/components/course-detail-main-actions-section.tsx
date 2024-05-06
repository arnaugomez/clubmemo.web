import { Button } from "@/src/common/ui/components/shadcn/ui/button";
import type { CourseModel } from "@/src/courses/domain/models/course-model";
import Link from "next/link";
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
      {course.isEnrolled && (
        <Button className="w-full" asChild>
          <Link href={`/courses/detail/${course.id}/practice`}>Practicar</Link>
        </Button>
      )}
    </div>
  );
}
