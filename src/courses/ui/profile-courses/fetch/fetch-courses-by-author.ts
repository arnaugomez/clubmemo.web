import type { TokenPaginationModelData } from "@/src/common/domain/models/token-pagination-model";
import type { GetCoursesByAuthorInputModel } from "@/src/courses/domain/interfaces/courses-repository";
import type { DiscoverCourseModelData } from "@/src/courses/domain/models/discover-course-model";
import { locator_courses_CoursesRepository } from "@/src/courses/locators/locator_courses-repository";

export async function fetchCoursesByAuthor(
  input: GetCoursesByAuthorInputModel,
): Promise<TokenPaginationModelData<DiscoverCourseModelData>> {
  const coursesRepository = locator_courses_CoursesRepository();
  const results = await coursesRepository.getCoursesByAuthor(input);
  return results.toData((e) => e.data);
}
