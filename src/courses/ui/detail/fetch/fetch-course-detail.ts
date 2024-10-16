import { locator_courses_CoursesRepository } from "@/src/courses/locators/locator_courses-repository";
import { cache } from "react";

export const fetchCourseDetail = cache(async function (
  id: string,
  profileId?: string,
) {
  const coursesRepository = locator_courses_CoursesRepository();
  return await coursesRepository.getDetail({
    id,
    profileId,
  });
});
