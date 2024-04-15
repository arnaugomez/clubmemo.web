import { coursesLocator } from "@/src/core/courses/courses-locator";
import { fetchMyProfile } from "../../../profile/fetch/fetch-my-profile";

export async function fetchInterestingCourses() {
  const profile = await fetchMyProfile();
  if (!profile) return [];
  const useCase = await coursesLocator.GetInterestingCoursesUseCase();
  return useCase.execute(profile.id);
}
