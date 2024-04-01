"use server";

import { locator } from "@/src/core/app/locator";
import { ProfileDoesNotExistError } from "@/src/core/profile/domain/errors/profile-errors";
import { ActionResponse } from "@/src/ui/view-models/server-form-errors";
import { revalidatePath } from "next/cache";
import { fetchMyProfile } from "../../../profile/fetch/fetch-my-profile";

export async function enrollCourseAction(
  courseId: string,
): Promise<Promise<void>> {
  try {
    const profile = await fetchMyProfile();
    if (!profile) throw new ProfileDoesNotExistError();
    const courseEnrollmentsRepository =
      await locator.CourseEnrollmentsRepository();
    await courseEnrollmentsRepository.create({
      courseId,
      profileId: profile.id,
    });
    revalidatePath(`/courses`);
  } catch (error) {
    if (error instanceof ProfileDoesNotExistError) {
      ActionResponse.formGlobalError("profileDoesNotExist");
    } else {
      // TODO: Log error
      console.error(error);
      ActionResponse.formGlobalError("general");
    }
  }
}
