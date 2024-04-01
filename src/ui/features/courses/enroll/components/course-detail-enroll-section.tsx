"use client";

import {
  CourseModel,
  CourseModelData,
} from "@/src/core/courses/domain/models/course-model";
import { AsyncButton } from "@/src/ui/components/button/async-button";
import { useState } from "react";
import { enrollCourseAction } from "../../detail/actions/enroll-course-action";

interface CourseDetailEnrollSectionProps {
  courseData: CourseModelData;
}

export function CourseDetailEnrollSection({
  courseData,
}: CourseDetailEnrollSectionProps) {
  const course = new CourseModel(courseData);
  const [isEnrolled, setIsEnrolled] = useState(course.isEnrolled);

  if (isEnrolled) {
    return <></>;
  }
  return (
    <AsyncButton
      onClick={async function enroll() {
        await enrollCourseAction(course.id);
        setIsEnrolled(true);
      }}
      variant="outline"
    >
      Añadir
    </AsyncButton>
  );
}
