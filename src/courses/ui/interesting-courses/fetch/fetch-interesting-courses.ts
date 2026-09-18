import * as Effect from "effect/Effect";
import { runServer } from "@/src/common/effect/server-runtime";
import { GetInterestingCoursesUseCaseService } from "@/src/courses/layers/layer_get-interesting-courses-use-case";
import { fetchMyProfile } from "../../../../profile/ui/fetch/fetch-my-profile";

export async function fetchInterestingCourses() {
  return runServer(
    Effect.gen(function* () {
      const profile = yield* Effect.tryPromise({
        try: () => fetchMyProfile(),
        catch: (error) => error,
      });
      if (!profile) return [];
      const useCase = yield* GetInterestingCoursesUseCaseService;
      return yield* useCase.execute(profile.id);
    }),
  );
}
