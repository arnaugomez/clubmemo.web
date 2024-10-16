import type { GetDiscoverCoursesInputModel } from "@/src/courses/domain/interfaces/courses-repository";
import { locator_courses_CoursesRepository } from "@/src/courses/locators/locator_courses-repository";

export const fetchDiscoverCourses = async (
  input: GetDiscoverCoursesInputModel,
) => {
  const coursesRepository = locator_courses_CoursesRepository();
  const pagination = await coursesRepository.getDiscoverCourses(input);
  return pagination.toData((e) => e.data);
};
