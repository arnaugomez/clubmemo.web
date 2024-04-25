import { locator } from "@/src/common/locator";
import { unstable_cache } from "next/cache";
import { cache } from "react";
import { fetchMyProfile } from "../../../../profile/ui/fetch/fetch-my-profile";

const cached = cache(async function () {
  const profile = await fetchMyProfile();
  if (!profile) return false;
  const coursesRepository = await locator.CoursesRepository();
  return await coursesRepository.getHasCourses({
    profileId: profile.id,
  });
});

export const fetchHasCourses = unstable_cache(cached, ["hasCourses"], {
  tags: ["hasCourses"],
});
