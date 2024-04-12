"use server";

import { locator } from "@/src/core/common/locator";
import { ProfileDoesNotExistError } from "@/src/core/profile/domain/errors/profile-errors";
import { ActionResponse } from "@/src/ui/models/server-form-errors";
import { revalidatePath, revalidateTag } from "next/cache";
import { fetchMyProfile } from "../../../profile/fetch/fetch-my-profile";

export async function unenrollCourseAction(courseId: string) {
  try {
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
    if (error instanceof ProfileDoesNotExistError) {
      return ActionResponse.formGlobalError("profileDoesNotExist");
    } else {
      // TODO: Log error
      console.error(error);
      return ActionResponse.formGlobalError("general");
    }
  }
}
