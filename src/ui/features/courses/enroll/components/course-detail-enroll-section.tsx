"use client";

import {
  CourseModel,
  CourseModelData,
} from "@/src/core/courses/domain/models/course-model";
import { AsyncButton } from "@/src/ui/components/button/async-button";
import { FormResponseHandler } from "@/src/ui/view-models/server-form-errors";
import { enrollCourseAction } from "../actions/enroll-course-action";

interface CourseDetailEnrollSectionProps {
  courseData: CourseModelData;
}

export function CourseDetailEnrollSection({
  courseData,
}: CourseDetailEnrollSectionProps) {
  const course = new CourseModel(courseData);

  const isEnrolled = course.isEnrolled;

  if (isEnrolled) {
    return <></>;
  }
  return (
    <AsyncButton
      onClick={async function enroll() {
        const response = await enrollCourseAction(course.id);
        const handler = new FormResponseHandler(response);
        if (handler.hasErrors) {
          handler.toastErrors();
        }
      }}
      variant="outline"
    >
      Añadir
    </AsyncButton>
  );
}
