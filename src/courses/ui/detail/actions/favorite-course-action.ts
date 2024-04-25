"use server";

import { locator } from "@/src/common/locator";
import { ActionResponse } from "@/src/common/ui/models/server-form-errors";
import { ProfileDoesNotExistError } from "@/src/profile/domain/errors/profile-errors";
import { revalidatePath } from "next/cache";
import { fetchMyProfile } from "../../../../profile/ui/fetch/fetch-my-profile";

interface FavoriteCourseActionModel {
  courseId: string;
  isFavorite: boolean;
}

export async function favoriteCourseAction({
  courseId,
  isFavorite,
}: FavoriteCourseActionModel) {
  try {
    const profile = await fetchMyProfile();
    if (!profile) throw new ProfileDoesNotExistError();

    const courseEnrollmentsRepository =
      await locator.CourseEnrollmentsRepository();
    await courseEnrollmentsRepository.setFavorite({
      profileId: profile.id,
      courseId,
      isFavorite,
    });
    revalidatePath("/courses");
    revalidatePath("/learn");
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
