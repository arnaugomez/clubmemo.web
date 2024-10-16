"use server";

import { ActionErrorHandler } from "@/src/common/ui/actions/action-error-handler";
import { ProfileDoesNotExistError } from "@/src/profile/domain/errors/profile-errors";
import { revalidatePath } from "next/cache";
import { fetchMyProfile } from "../../../../profile/ui/fetch/fetch-my-profile";
import type { EnrollCourseActionModel } from "../schemas/enroll-course-action-schema";
import { EnrollCourseActionSchema } from "../schemas/enroll-course-action-schema";
import { locator_courses_CourseEnrollmentsRepository } from "@/src/courses/locators/locator_course-enrollments-repository";

export async function enrollCourseAction(input: EnrollCourseActionModel) {
  try {
    const { courseId } = EnrollCourseActionSchema.parse(input);

    const profile = await fetchMyProfile();
    if (!profile) throw new ProfileDoesNotExistError();
    const courseEnrollmentsRepository =
      locator_courses_CourseEnrollmentsRepository();
    await courseEnrollmentsRepository.create({
      courseId,
      profileId: profile.id,
    });
    revalidatePath(`/courses`);
    revalidatePath(`/learn`);
  } catch (error) {
    return ActionErrorHandler.handle(error);
  }
}
