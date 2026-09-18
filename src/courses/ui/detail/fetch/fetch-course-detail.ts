import * as Effect from "effect/Effect";
import { cache } from "react";
import { runServer } from "@/src/common/effect/server-runtime";
import { CoursesRepository } from "@/src/courses/layers/layer_courses-repository";

export const fetchCourseDetail = cache(
  async (id: string, profileId?: string) => {
    return runServer(
      Effect.gen(function* () {
        const coursesRepository = yield* CoursesRepository;
        return yield* coursesRepository.getDetail({
          id,
          profileId,
        });
      }),
    );
  },
);
