import * as Effect from "effect/Effect";
import { runServer } from "@/src/common/effect/server-runtime";
import type { GetDiscoverCoursesInputModel } from "@/src/courses/domain/interfaces/courses-repository";
import { CoursesRepository } from "@/src/courses/layers/layer_courses-repository";

/**
 * Loads a paginated list of courses that match the search query in the Discover
 * section. This function is meant to be called inside a React Server Component.
 */
export const fetchDiscoverCourses = async (
  input: GetDiscoverCoursesInputModel,
) => {
  return runServer(
    Effect.gen(function* () {
      const coursesRepository = yield* CoursesRepository;
      const pagination = yield* coursesRepository.getDiscoverCourses(input);
      return pagination.toData((e) => e.data);
    }),
  );
};
