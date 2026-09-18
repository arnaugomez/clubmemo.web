import * as Context from "effect/Context";
import * as Effect from "effect/Effect";
import { ProfileDoesNotExistError } from "@/src/profile/domain/errors/profile-errors";
import { GetMyProfileUseCase } from "@/src/profile/domain/use-cases/get-my-profile-use-case";
import { CoursesRepository } from "../interfaces/courses-repository";

/**
 * Creates a new empty course
 *
 * @param input The input data to create a course, including the name of the course
 * @throws {ProfileDoesNotExistError} When the user is not logged in
 */
export class CreateCourseUseCase extends Context.Service<CreateCourseUseCase>()(
  "clubmemo/courses/domain/use-cases/create-course-use-case",
  {
    make: Effect.gen(function* () {
      const getMyProfileUseCase = yield* GetMyProfileUseCase;
      const coursesRepository = yield* CoursesRepository;
      const execute = Effect.fn("CreateCourseUseCase.execute")(function* (
        input: CreateCourseInputModel,
      ) {
        const profile = yield* getMyProfileUseCase.execute();
        if (!profile) return yield* Effect.fail(new ProfileDoesNotExistError());

        return yield* coursesRepository.create({
          name: input.name,
          profileId: profile.id,
        });
      });
      return { execute };
    }),
  },
) {}

interface CreateCourseInputModel {
  name: string;
}

export const CreateCourseUseCaseService = CreateCourseUseCase;
