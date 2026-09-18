import * as Context from "effect/Context";
import * as Effect from "effect/Effect";
import { NoPermissionError } from "@/src/common/domain/models/app-errors";
import { NotesRepository } from "@/src/notes/domain/interfaces/notes-repository";
import { ProfileDoesNotExistError } from "@/src/profile/domain/errors/profile-errors";
import { GetMyProfileUseCase } from "@/src/profile/domain/use-cases/get-my-profile-use-case";
import { CoursesRepository } from "../interfaces/courses-repository";
import { CourseDoesNotExistError } from "../models/course-errors";

/**
 * Creates a copy of a course and assigns it to the profile of the current user (the one
 * that is logged in).
 *
 * Not only is the data of the course copied, but also the notes that belong to the course.
 * The new course and notes are independent from the original ones, so changes in the original
 * course or notes do not affect the new ones.
 *
 * @throws {ProfileDoesNotExistError} When the user is not logged in
 * @throws {CourseDoesNotExistError} When the course does not exist
 * @throws {NoPermissionError} When the user does not have permission to view the course
 */
export class CopyCourseUseCase extends Context.Service<CopyCourseUseCase>()(
  "clubmemo/courses/domain/use-cases/copy-course-use-case",
  {
    make: Effect.gen(function* () {
      const coursesRepository = yield* CoursesRepository;
      const notesRepository = yield* NotesRepository;
      const getMyProfileUseCase = yield* GetMyProfileUseCase;
      const execute = Effect.fn("CopyCourseUseCase.execute")(function* (
        courseId: string,
      ) {
        const profile = yield* getMyProfileUseCase.execute();
        if (!profile) return yield* Effect.fail(new ProfileDoesNotExistError());
        const profileId = profile.id;

        const course = yield* coursesRepository.getDetail({
          id: courseId,
          profileId,
        });
        if (!course) return yield* Effect.fail(new CourseDoesNotExistError());
        if (!course.canView) return yield* Effect.fail(new NoPermissionError());
        const newCourse = yield* coursesRepository.create({
          name: `${course.name} (Copia)`,
          profileId,
        });

        yield* Effect.all(
          [
            coursesRepository.update({
              id: newCourse.id,
              name: newCourse.name,
              isPublic: false,
              description: course.description ?? "",
              tags: course.tags,
              picture: course.picture,
            }),
            notesRepository.copy({
              sourceCourseId: courseId,
              targetCourseId: newCourse.id,
            }),
          ],
          { concurrency: "unbounded" },
        );

        return newCourse;
      });
      return { execute };
    }),
  },
) {}

export const CopyCourseUseCaseService = CopyCourseUseCase;
