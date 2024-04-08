"use client";

import {
  CourseModel,
  CourseModelData,
} from "@/src/core/courses/domain/models/course-model";
import { AsyncButton } from "@/src/ui/components/button/async-button";
import { FormResponseHandler } from "@/src/ui/models/server-form-errors";
import { useState } from "react";
import { enrollCourseAction } from "../actions/enroll-course-action";

interface CourseDetailEnrollSectionProps {
  courseData: CourseModelData;
}

export function CourseDetailEnrollSection({
  courseData,
}: CourseDetailEnrollSectionProps) {
  const course = new CourseModel(courseData);
  return <EnrollButton key={course.isEnrolled.toString()} course={course} />;
}

interface EnrollButtonProps {
  course: CourseModel;
}

function EnrollButton({ course }: EnrollButtonProps) {
  const [isEnrolled, setIsEnrolled] = useState(course.isEnrolled);

  if (isEnrolled) {
    return <></>;
  }
  return (
    <AsyncButton
      onClick={async function enroll() {
        const response = await enrollCourseAction(course.id);
        const handler = new FormResponseHandler(response);
        if (!handler.hasErrors) {
          setIsEnrolled(true);
        }
        handler.toastErrors();
      }}
      className="w-full"
    >
      Unirme al curso
    </AsyncButton>
  );
}
