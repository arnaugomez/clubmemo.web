"use client";

import {
  CourseModel,
  CourseModelData,
} from "@/src/core/courses/domain/models/course-model";
import { Button } from "@/src/ui/components/shadcn/ui/button";

interface CourseDetailEditSectionProps {
  courseData: CourseModelData;
}

export function CourseDetailEditSection({
  courseData,
}: CourseDetailEditSectionProps) {
  const course = new CourseModel(courseData);
  console.log(course);
  return (
    <>
      <Button variant="outline">Editar</Button>
    </>
  );
}
