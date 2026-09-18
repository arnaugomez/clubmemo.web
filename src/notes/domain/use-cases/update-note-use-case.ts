import * as Context from "effect/Context";
import * as Effect from "effect/Effect";
import { NoPermissionError } from "@/src/common/domain/models/app-errors";
import { CoursesRepository } from "@/src/courses/domain/interfaces/courses-repository";
import { CourseDoesNotExistError } from "@/src/courses/domain/models/course-errors";
import { ProfileDoesNotExistError } from "@/src/profile/domain/errors/profile-errors";
import { GetMyProfileUseCase } from "@/src/profile/domain/use-cases/get-my-profile-use-case";
import { NotesRepository } from "../interfaces/notes-repository";
import { NoteDoesNotExistError } from "../models/notes-errors";
import type { UpdateNoteInputModel } from "../models/update-note-input-model";

/**
 * Updates a note of a course
 * @param input The input data to update a note, including the note id, and the
 * new note content
 * @throws {ProfileDoesNotExistError} When the user is not logged in
 * @throws {CourseDoesNotExistError} When the course does not exist
 * @throws {NoteDoesNotExistError} When the note does not exist
 * @throws {NoPermissionError} When the user does not have permission to edit
 * the note
 * @returns The updated note
 */
export class UpdateNoteUseCase extends Context.Service<UpdateNoteUseCase>()(
  "clubmemo/notes/domain/use-cases/update-note-use-case",
  {
    make: Effect.gen(function* () {
      const getMyProfileUseCase = yield* GetMyProfileUseCase;
      const coursesRepository = yield* CoursesRepository;
      const notesRepository = yield* NotesRepository;
      const execute = Effect.fn("UpdateNoteUseCase.execute")(function* (
        input: UpdateNoteInputModel,
      ) {
        const profile = yield* getMyProfileUseCase.execute();
        if (!profile) return yield* Effect.fail(new ProfileDoesNotExistError());

        const note = yield* notesRepository.getDetail(input.id);
        if (!note) return yield* Effect.fail(new NoteDoesNotExistError());

        const course = yield* coursesRepository.getDetail({
          id: note.courseId,
          profileId: profile.id,
        });
        if (!course) return yield* Effect.fail(new CourseDoesNotExistError());
        if (!course.canEdit) return yield* Effect.fail(new NoPermissionError());

        yield* notesRepository.update(input);
        return yield* notesRepository.getDetail(input.id);
      });
      return { execute };
    }),
  },
) {}

export const UpdateNoteUseCaseService = UpdateNoteUseCase;
