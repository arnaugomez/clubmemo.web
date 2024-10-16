"use server";

import { ActionErrorHandler } from "@/src/common/ui/actions/action-error-handler";
import { ProfileDoesNotExistError } from "@/src/profile/domain/errors/profile-errors";
import { revalidatePath } from "next/cache";
import { fetchMyProfile } from "../../../../profile/ui/fetch/fetch-my-profile";
import type { UnenrollCourseActionModel } from "../schemas/unenroll-course-action-schema";
import { UnenrollCourseActionSchema } from "../schemas/unenroll-course-action-schema";
import { locator_courses_CourseEnrollmentsRepository } from "@/src/courses/locators/locator_course-enrollments-repository";

export async function unenrollCourseAction(input: UnenrollCourseActionModel) {
  try {
    const { courseId } = UnenrollCourseActionSchema.parse(input);

    const profile = await fetchMyProfile();
    if (!profile) throw new ProfileDoesNotExistError();

    const courseEnrollmentsRepository =
      locator_courses_CourseEnrollmentsRepository();
    await courseEnrollmentsRepository.delete({
      courseId,
      profileId: profile.id,
    });

    revalidatePath(`/courses`);
    revalidatePath(`/learn`);
  } catch (error) {
    return ActionErrorHandler.handle(error);
  }
}
