"use server";

import { locator } from "@/src/common/locator";
import { ActionErrorHandler } from "@/src/common/ui/actions/action-error-handler";
import { ProfileDoesNotExistError } from "@/src/profile/domain/errors/profile-errors";
import { revalidatePath, revalidateTag } from "next/cache";
import { fetchMyProfile } from "../../../../profile/ui/fetch/fetch-my-profile";
import type { UnenrollCourseActionModel } from "../schemas/unenroll-course-action-schema";
import { UnenrollCourseActionSchema } from "../schemas/unenroll-course-action-schema";

export async function unenrollCourseAction(input: UnenrollCourseActionModel) {
  try {
    const { courseId } = UnenrollCourseActionSchema.parse(input);

    const profile = await fetchMyProfile();
    if (!profile) throw new ProfileDoesNotExistError();

    const courseEnrollmentsRepository =
      await locator.CourseEnrollmentsRepository();
    await courseEnrollmentsRepository.delete({
      courseId,
      profileId: profile.id,
    });

    revalidatePath(`/courses`);
    revalidatePath(`/learn`);
    revalidateTag("hasCourses");
  } catch (error) {
    return ActionErrorHandler.handle(error);
  }
}
