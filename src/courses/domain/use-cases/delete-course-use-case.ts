import * as Context from "effect/Context";
import * as Effect from "effect/Effect";
import { NotesRepository } from "@/src/notes/domain/interfaces/notes-repository";
import { ProfileDoesNotExistError } from "@/src/profile/domain/errors/profile-errors";
import { GetMyProfileUseCase } from "@/src/profile/domain/use-cases/get-my-profile-use-case";
import { CourseEnrollmentsRepository } from "../interfaces/course-enrollments-repository";
import { CoursePermissionsRepository } from "../interfaces/course-permissions-repository";
import { CoursesRepository } from "../interfaces/courses-repository";
import {
  CannotDeleteCourseError,
  CourseDoesNotExistError,
} from "../models/course-errors";

/**
 * Deletes a course permanently
 *
 * @param courseId The id of the course to delete
 * @throws {ProfileDoesNotExistError} When the user is not logged in
 * @throws {CourseDoesNotExistError} When the course does not exist
 * @throws {CannotDeleteCourseError} When the course cannot be deleted because
 * the profile does not have permission to do so
 */
export class DeleteCourseUseCase extends Context.Service<DeleteCourseUseCase>()(
  "clubmemo/courses/domain/use-cases/delete-course-use-case",
  {
    make: Effect.gen(function* () {
      const getMyProfileUseCase = yield* GetMyProfileUseCase;
      const coursesRepository = yield* CoursesRepository;
      const courseEnrollmentsRepository = yield* CourseEnrollmentsRepository;
      const coursePermissionsRepository = yield* CoursePermissionsRepository;
      const notesRepository = yield* NotesRepository;
      const execute = Effect.fn("DeleteCourseUseCase.execute")(function* (
        courseId: string,
      ) {
        const profile = yield* getMyProfileUseCase.execute();
        if (!profile) return yield* Effect.fail(new ProfileDoesNotExistError());

        const course = yield* coursesRepository.getDetail({
          id: courseId,
          profileId: profile.id,
        });
        if (!course) return yield* Effect.fail(new CourseDoesNotExistError());
        if (!course.canDelete)
          return yield* Effect.fail(new CannotDeleteCourseError());
        yield* coursesRepository.delete(courseId);
        yield* Effect.all(
          [
            courseEnrollmentsRepository.deleteByCourseId(courseId),
            coursePermissionsRepository.deleteByCourseId(courseId),
            notesRepository.deleteByCourseId(courseId),
          ],
          { concurrency: "unbounded" },
        );
      });
      return { execute };
    }),
  },
) {}

export const DeleteCourseUseCaseService = DeleteCourseUseCase;
