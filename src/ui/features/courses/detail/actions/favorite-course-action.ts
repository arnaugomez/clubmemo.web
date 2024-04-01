"use server";

import { locator } from "@/src/core/app/locator";
import { ProfileDoesNotExistError } from "@/src/core/profile/domain/errors/profile-errors";
import { ActionResponse } from "@/src/ui/view-models/server-form-errors";
import { fetchMyProfile } from "../../../profile/fetch/fetch-my-profile";

interface FavoriteCourseActionModel {
  courseId: string;
  isFavorite: boolean;
}

export async function favoriteCourseAction({
  courseId,
  isFavorite,
}: FavoriteCourseActionModel): Promise<Promise<void>> {
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
