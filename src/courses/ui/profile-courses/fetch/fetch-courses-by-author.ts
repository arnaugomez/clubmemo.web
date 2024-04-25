import { TokenPaginationModelData } from "@/src/common/domain/models/token-pagination-model";
import { locator } from "@/src/common/locator";
import { GetCoursesByAuthorInputModel } from "@/src/courses/domain/interfaces/courses-repository";
import { DiscoverCourseModelData } from "@/src/courses/domain/models/discover-course-model";

export async function fetchCoursesByAuthor(
  input: GetCoursesByAuthorInputModel,
): Promise<TokenPaginationModelData<DiscoverCourseModelData>> {
  const coursesRepository = await locator.CoursesRepository();
  const results = await coursesRepository.getCoursesByAuthor(input);
  return results.toData((e) => e.data);
}