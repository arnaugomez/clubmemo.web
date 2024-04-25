import { locator } from "@/src/common/locator";
import { cache } from "react";
import { fetchMyProfile } from "../../../../profile/ui/fetch/fetch-my-profile";

export const fetchFavoriteCourses = cache(async function () {
  const profile = await fetchMyProfile();
  if (!profile) return [];
  const coursesRepository = await locator.CoursesRepository();
  return await coursesRepository.getMyCourses({
    profileId: profile.id,
    isFavorite: true,
    limit: 6,
  });
});
