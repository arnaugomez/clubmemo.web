import { locator } from "@/src/core/app/locator";
import { GetDiscoverCoursesInputModel } from "@/src/core/courses/domain/interfaces/courses-repository";

export const fetchDiscoverCourses = async (
  input: GetDiscoverCoursesInputModel,
) => {
  const coursesRepository = await locator.CoursesRepository();
  return await coursesRepository.getDiscoverCourses(input);
};
