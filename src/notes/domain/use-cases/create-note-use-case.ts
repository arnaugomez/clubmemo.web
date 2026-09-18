import * as Context from "effect/Context";
import * as Effect from "effect/Effect";
import { NoPermissionError } from "@/src/common/domain/models/app-errors";
import { CoursesRepository } from "@/src/courses/domain/interfaces/courses-repository";
import { CourseDoesNotExistError } from "@/src/courses/domain/models/course-errors";
import { ProfileDoesNotExistError } from "@/src/profile/domain/errors/profile-errors";
import { GetMyProfileUseCase } from "@/src/profile/domain/use-cases/get-my-profile-use-case";
import { NotesRepository } from "../interfaces/notes-repository";
import type { CreateNoteInputModel } from "../models/create-note-input-model";

/**
 * Creates a new note for a course
 *
 * @input The input data to create a note, including the course id, and the note content
 * @returns The created note
 *
 * @throws {ProfileDoesNotExistError} When the user is not logged in
 * @throws {CourseDoesNotExistError} When the course does not exist
 */
export class CreateNoteUseCase extends Context.Service<CreateNoteUseCase>()(
  "clubmemo/notes/domain/use-cases/create-note-use-case",
  {
    make: Effect.gen(function* () {
      const getMyProfileUseCase = yield* GetMyProfileUseCase;
      const coursesRepository = yield* CoursesRepository;
      const notesRepository = yield* NotesRepository;
      const execute = Effect.fn("CreateNoteUseCase.execute")(function* (
        input: CreateNoteInputModel,
      ) {
        const profile = yield* getMyProfileUseCase.execute();
        if (!profile) return yield* Effect.fail(new ProfileDoesNotExistError());

        const course = yield* coursesRepository.getDetail({
          id: input.courseId,
          profileId: profile.id,
        });
        if (!course) return yield* Effect.fail(new CourseDoesNotExistError());
        if (!course.canEdit) return yield* Effect.fail(new NoPermissionError());

        return yield* notesRepository.create(input);
      });
      return { execute };
    }),
  },
) {}

export const CreateNoteUseCaseService = CreateNoteUseCase;
