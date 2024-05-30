import { locator } from "@/src/common/di/locator";
import { cache } from "react";

export const fetchCourseDetail = cache(async function (
  id: string,
  profileId?: string,
) {
  const coursesRepository = await locator.CoursesRepository();
  return await coursesRepository.getDetail({
    id,
    profileId,
  });
});
