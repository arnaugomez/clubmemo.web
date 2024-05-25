"use server";

import { locator } from "@/src/common/locator";
import { ActionErrorHandler } from "@/src/common/ui/actions/action-error-handler";
import { ProfileDoesNotExistError } from "@/src/profile/domain/errors/profile-errors";
import { revalidatePath } from "next/cache";
import { fetchMyProfile } from "../../../../profile/ui/fetch/fetch-my-profile";
import type { FavoriteCourseActionModel } from "../schemas/favorite-course-action-schema";
import { FavoriteCourseActionSchema } from "../schemas/favorite-course-action-schema";

export async function favoriteCourseAction(input: FavoriteCourseActionModel) {
  try {
    const { courseId, isFavorite } = FavoriteCourseActionSchema.parse(input);
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
  } catch (e) {
    return ActionErrorHandler.handle(e);
  }
}
