import { locator } from "@/src/common/locator";
import type { GetDiscoverCoursesInputModel } from "@/src/courses/domain/interfaces/courses-repository";

export const fetchDiscoverCourses = async (
  input: GetDiscoverCoursesInputModel,
) => {
  const coursesRepository = await locator.CoursesRepository();
  const pagination = await coursesRepository.getDiscoverCourses(input);
  return pagination.toData((e) => e.data);
};
