import { locator } from "@/src/common/di/locator";
import { unstable_cache } from "next/cache";
import { cache } from "react";

const cached = cache(async function (profileId: string) {
  const coursesRepository = await locator.CoursesRepository();
  return await coursesRepository.getHasCourses({
    profileId,
  });
});

export const fetchHasCourses = unstable_cache(cached, ["hasCourses"], {
  tags: ["hasCourses"],
});
