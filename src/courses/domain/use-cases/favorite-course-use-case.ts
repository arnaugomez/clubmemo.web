import * as Context from "effect/Context";
import * as Effect from "effect/Effect";
import { ProfileDoesNotExistError } from "@/src/profile/domain/errors/profile-errors";
import { GetMyProfileUseCase } from "@/src/profile/domain/use-cases/get-my-profile-use-case";
import { CourseEnrollmentsRepository } from "../interfaces/course-enrollments-repository";

/**
 * Sets a course as favorite or not favorite
 *
 * @param courseId The id of the course to favorite or unfavorite
 *
 * @throws {ProfileDoesNotExistError} When the user is not logged in
 */
export class FavoriteCourseUseCase extends Context.Service<FavoriteCourseUseCase>()(
  "clubmemo/courses/domain/use-cases/favorite-course-use-case",
  {
    make: Effect.gen(function* () {
      const getMyProfileUseCase = yield* GetMyProfileUseCase;
      const courseEnrollmentsRepository = yield* CourseEnrollmentsRepository;
      const execute = Effect.fn("FavoriteCourseUseCase.execute")(function* ({
        courseId,
        isFavorite,
      }: FavoriteCourseUseCaseInputModel) {
        const profile = yield* getMyProfileUseCase.execute();
        if (!profile) return yield* Effect.fail(new ProfileDoesNotExistError());

        yield* courseEnrollmentsRepository.setFavorite({
          profileId: profile.id,
          courseId,
          isFavorite,
        });
      });
      return { execute };
    }),
  },
) {}

interface FavoriteCourseUseCaseInputModel {
  courseId: string;
  isFavorite: boolean;
}

export const FavoriteCourseUseCaseService = FavoriteCourseUseCase;
