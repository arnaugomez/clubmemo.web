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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const course = new CourseModel(courseData);
  return (
    <>
      <Button variant="outline" size="icon">
        <Ellipsis />
        <span className="sr-only">Ajustes del curso</span>
      </Button>
    </>
  );
}
