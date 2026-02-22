import { cache } from "react";
import { locator_courses_CoursesRepository } from "@/src/courses/locators/locator_courses-repository";

export const fetchCourseDetail = cache(
  async (id: string, profileId?: string) => {
    const coursesRepository = locator_courses_CoursesRepository();
    return await coursesRepository.getDetail({
      id,
      profileId,
    });
  },
);
