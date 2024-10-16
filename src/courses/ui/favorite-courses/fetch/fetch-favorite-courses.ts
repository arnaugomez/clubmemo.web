import { cache } from "react";
import { fetchMyProfile } from "../../../../profile/ui/fetch/fetch-my-profile";
import { locator_courses_CoursesRepository } from "@/src/courses/locators/locator_courses-repository";

export const fetchFavoriteCourses = cache(async function () {
  const profile = await fetchMyProfile();
  if (!profile) return [];
  const coursesRepository = locator_courses_CoursesRepository();
  return await coursesRepository.getMyCourses({
    profileId: profile.id,
    isFavorite: true,
    limit: 6,
  });
});
