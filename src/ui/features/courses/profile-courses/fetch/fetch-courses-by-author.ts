import { TokenPaginationModelData } from "@/src/core/app/domain/models/token-pagination-model";
import { locator } from "@/src/core/app/locator";
import { GetCoursesByAuthorInputModel } from "@/src/core/courses/domain/interfaces/courses-repository";
import { DiscoverCourseModelData } from "@/src/core/courses/domain/models/discover-course-model";

export async function fetchCoursesByAuthor(
  input: GetCoursesByAuthorInputModel,
): Promise<TokenPaginationModelData<DiscoverCourseModelData>> {
  const coursesRepository = await locator.CoursesRepository();
  const results = await coursesRepository.getCoursesByAuthor(input);
  return results.toData((e) => e.data);
}
