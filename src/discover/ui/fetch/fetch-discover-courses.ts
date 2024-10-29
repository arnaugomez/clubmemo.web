import type { GetDiscoverCoursesInputModel } from "@/src/courses/domain/interfaces/courses-repository";
import { locator_courses_CoursesRepository } from "@/src/courses/locators/locator_courses-repository";

/**
 * Loads a paginated list of courses that match the search query in the Discover
 * section. This function is meant to be called inside a React Server Component.
 */
export const fetchDiscoverCourses = async (
  input: GetDiscoverCoursesInputModel,
) => {
  const coursesRepository = locator_courses_CoursesRepository();
  const pagination = await coursesRepository.getDiscoverCourses(input);
  return pagination.toData((e) => e.data);
};
