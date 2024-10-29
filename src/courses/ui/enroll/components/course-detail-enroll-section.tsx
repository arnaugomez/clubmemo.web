"use client";

import { locator_common_ErrorTrackingService } from "@/src/common/locators/locator_error-tracking-service";
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

  async function handleEnroll() {
    if (!isLoggedIn) {
      toast.error("Debes iniciar sesión para unirte al curso");
      return;
    }

    try {
      const response = await enrollCourseAction({ courseId: course.id });
      const handler = new FormResponseHandler(response);
      if (!handler.hasErrors) {
        setIsEnrolled(true);
      }
      handler.toastErrors();
    } catch (error) {
      locator_common_ErrorTrackingService().captureError(error);
      toast.error("Error al apuntarse al curso");
    }
  }

  return (
    <AsyncButton onClick={handleEnroll} className="w-full">
      Unirme al curso
    </AsyncButton>
  );
}
