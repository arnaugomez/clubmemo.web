import * as Effect from "effect/Effect";
import type { TokenPaginationModelData } from "@/src/common/domain/models/token-pagination-model";
import { runServer } from "@/src/common/effect/server-runtime";
import type { GetCoursesByAuthorInputModel } from "@/src/courses/domain/interfaces/courses-repository";
import type { DiscoverCourseModelData } from "@/src/courses/domain/models/discover-course-model";
import { CoursesRepository } from "@/src/courses/layers/layer_courses-repository";

export async function fetchCoursesByAuthor(
  input: GetCoursesByAuthorInputModel,
): Promise<TokenPaginationModelData<DiscoverCourseModelData>> {
  return runServer(
    Effect.gen(function* () {
      const coursesRepository = yield* CoursesRepository;
      const results = yield* coursesRepository.getCoursesByAuthor(input);
      return results.toData((e) => e.data);
    }),
  );
}
