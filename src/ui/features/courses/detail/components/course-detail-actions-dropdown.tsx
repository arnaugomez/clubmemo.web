"use client";

import {
  CourseModel,
  CourseModelData,
} from "@/src/core/courses/domain/models/course-model";
import { Button } from "@/src/ui/components/shadcn/ui/button";
import { Ellipsis } from "lucide-react";

interface CourseDetailActionsDropdownProps {
  courseData: CourseModelData;
}

export function CourseDetailActionsDropdown({
  courseData,
}: CourseDetailActionsDropdownProps) {
  const course = new CourseModel(courseData);
  console.log(course);
  return (
    <>
      <Button variant="outline" size="icon">
        <Ellipsis />
        <span className="sr-only">Ajustes del curso</span>
      </Button>
    </>
  );
}
