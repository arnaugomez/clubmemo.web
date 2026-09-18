import * as Context from "effect/Context";
import * as Effect from "effect/Effect";
import { ProfileDoesNotExistError } from "@/src/profile/domain/errors/profile-errors";
import { GetMyProfileUseCase } from "@/src/profile/domain/use-cases/get-my-profile-use-case";
import { TagsRepository } from "@/src/tags/domain/interfaces/tags-repository";
import { CoursesRepository } from "../interfaces/courses-repository";
import {
  CannotEditCourseError,
  CourseDoesNotExistError,
} from "../models/course-errors";
import type { UpdateCourseInputModel } from "../models/update-course-input-model";

/**
 * Edits the public data of the course, such as the name, description, tags and
 * picture. It also updates the public status of the course, letting its creator
 * decide whether it is public or private.
 *
 * If the course's picture is changed, `EditCourseUploadUseCase` should be
 * called first
 *
 * @param input The input data to update the course, including the course id and
 * the new data of the course
 *
 * @throws {ProfileDoesNotExistError} When the user is not logged in
 * @throws {CourseDoesNotExistError} When the course does not exist
 * @throws {CannotEditCourseError} When the course cannot be edited because the
 * profile lacks permission
 */
export class EditCourseUseCase extends Context.Service<EditCourseUseCase>()(
  "clubmemo/courses/domain/use-cases/edit-course-use-case",
  {
    make: Effect.gen(function* () {
      const getMyProfileUseCase = yield* GetMyProfileUseCase;
      const tagsRepository = yield* TagsRepository;
      const coursesRepository = yield* CoursesRepository;
      const execute = Effect.fn("EditCourseUseCase.execute")(function* (
        input: UpdateCourseInputModel,
      ) {
        const profile = yield* getMyProfileUseCase.execute();
        if (!profile) return yield* Effect.fail(new ProfileDoesNotExistError());

        const course = yield* coursesRepository.getDetail({
          id: input.id,
          profileId: profile.id,
        });
        if (!course) return yield* Effect.fail(new CourseDoesNotExistError());
        if (!course.canEdit)
          return yield* Effect.fail(new CannotEditCourseError());

        yield* Effect.all(
          [tagsRepository.create(input.tags), coursesRepository.update(input)],
          { concurrency: "unbounded" },
        );
      });
      return { execute };
    }),
  },
) {}

export const EditCourseUseCaseService = EditCourseUseCase;
