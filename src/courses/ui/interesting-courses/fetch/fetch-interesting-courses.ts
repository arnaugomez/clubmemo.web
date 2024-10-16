import { locator_courses_GetInterestingCoursesUseCase } from "@/src/courses/locators/locator_get-interesting-courses-use-case";
import { fetchMyProfile } from "../../../../profile/ui/fetch/fetch-my-profile";

export async function fetchInterestingCourses() {
  const profile = await fetchMyProfile();
  if (!profile) return [];
  const useCase = locator_courses_GetInterestingCoursesUseCase();
  return useCase.execute(profile.id);
}
