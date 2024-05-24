"use client";

import { AsyncButton } from "@/src/common/ui/components/button/async-button";
import { FormResponseHandler } from "@/src/common/ui/models/server-form-errors";
import type { CourseModelData } from "@/src/courses/domain/models/course-model";
import { CourseModel } from "@/src/courses/domain/models/course-model";
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
        const response = await enrollCourseAction({ courseId: course.id });
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
