"use client";

import { AsyncButton } from "@/src/common/ui/components/button/async-button";
import { FormResponseHandler } from "@/src/common/ui/models/server-form-errors";
import type { CourseModelData } from "@/src/courses/domain/models/course-model";
import { CourseModel } from "@/src/courses/domain/models/course-model";
import { useState } from "react";
import { toast } from "sonner";
import { CourseDetailPracticeButtonLoading } from "../../detail/components/course-detail-practice-button-loading";
import { enrollCourseAction } from "../actions/enroll-course-action";

interface CourseDetailEnrollSectionProps {
  courseData: CourseModelData;
  isLoggedIn: boolean;
}

export function CourseDetailEnrollSection({
  courseData,
  isLoggedIn,
}: CourseDetailEnrollSectionProps) {
  const course = new CourseModel(courseData);
  return (
    <EnrollButton
      key={course.isEnrolled.toString()}
      course={course}
      isLoggedIn={isLoggedIn}
    />
  );
}

interface EnrollButtonProps {
  course: CourseModel;
  isLoggedIn: boolean;
}

function EnrollButton({ course, isLoggedIn }: EnrollButtonProps) {
  const [isEnrolled, setIsEnrolled] = useState(course.isEnrolled);

  if (isEnrolled) {
    return <CourseDetailPracticeButtonLoading />;
  }
  return (
    <AsyncButton
      onClick={async function enroll() {
        if (!isLoggedIn) {
          toast.error("Debes iniciar sesión para unirte al curso.");
          return;
        }

        const response = await enrollCourseAction({ courseId: course.id });
        const handler = new FormResponseHandler(response);
        if (!handler.hasErrors) {
          setIsEnrolled(true);
        } else if (handler.data) handler.toastErrors();
      }}
      className="w-full"
    >
      Unirme al curso
    </AsyncButton>
  );
}
