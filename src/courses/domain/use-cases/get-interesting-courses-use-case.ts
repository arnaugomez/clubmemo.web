import * as Context from "effect/Context";
import * as Effect from "effect/Effect";
import { ProfileDoesNotExistError } from "@/src/profile/domain/errors/profile-errors";
import { ProfilesRepository } from "@/src/profile/domain/interfaces/profiles-repository";
import { CoursesRepository } from "../interfaces/courses-repository";

/**
 * Gets a list of recommended courses for the user, based on the interests
 * defined in their profile
 *
 * @param profileId The id of the profile to get the recommended courses
 * @throws {ProfileDoesNotExistError} When the user is not logged in
 * @returns A list of courses that might be interesting for the user
 */
export class GetInterestingCoursesUseCase extends Context.Service<GetInterestingCoursesUseCase>()(
  "clubmemo/courses/domain/use-cases/get-interesting-courses-use-case",
  {
    make: Effect.gen(function* () {
      const profilesRepository = yield* ProfilesRepository;
      const coursesRepository = yield* CoursesRepository;
      const execute = Effect.fn("GetInterestingCoursesUseCase.execute")(
        function* (profileId: string) {
          const profile = yield* profilesRepository.get(profileId);
          if (!profile)
            return yield* Effect.fail(new ProfileDoesNotExistError());

          return yield* coursesRepository.getInterestingCourses({
            profileId,
            tags: profile.tags,
          });
        },
      );
      return { execute };
    }),
  },
) {}

export const GetInterestingCoursesUseCaseService = GetInterestingCoursesUseCase;
