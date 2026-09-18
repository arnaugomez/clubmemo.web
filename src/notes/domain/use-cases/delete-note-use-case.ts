import * as Context from "effect/Context";
import * as Effect from "effect/Effect";
import { NoPermissionError } from "@/src/common/domain/models/app-errors";
import { CoursesRepository } from "@/src/courses/domain/interfaces/courses-repository";
import { CourseDoesNotExistError } from "@/src/courses/domain/models/course-errors";
import { ProfileDoesNotExistError } from "@/src/profile/domain/errors/profile-errors";
import { GetMyProfileUseCase } from "@/src/profile/domain/use-cases/get-my-profile-use-case";
import { NotesRepository } from "../interfaces/notes-repository";
import { NoteDoesNotExistError } from "../models/notes-errors";

/**
 * Deletes a note permanently, removing it from the course. It
 * also deletes all the practice cards of that note.
 *
 * @input The input data to delete a note, including the note id
 */
export class DeleteNoteUseCase extends Context.Service<DeleteNoteUseCase>()(
  "clubmemo/notes/domain/use-cases/delete-note-use-case",
  {
    make: Effect.gen(function* () {
      const getMyProfileUseCase = yield* GetMyProfileUseCase;
      const coursesRepository = yield* CoursesRepository;
      const notesRepository = yield* NotesRepository;
      const execute = Effect.fn("DeleteNoteUseCase.execute")(function* ({
        noteId,
      }: DeleteNoteUseCaseInputModel) {
        const profile = yield* getMyProfileUseCase.execute();
        if (!profile) return yield* Effect.fail(new ProfileDoesNotExistError());

        const note = yield* notesRepository.getDetail(noteId);
        if (!note) return yield* Effect.fail(new NoteDoesNotExistError());

        const course = yield* coursesRepository.getDetail({
          id: note.courseId,
          profileId: profile.id,
        });
        if (!course) return yield* Effect.fail(new CourseDoesNotExistError());
        if (!course.canDelete)
          return yield* Effect.fail(new NoPermissionError());

        yield* notesRepository.delete(noteId);
      });
      return { execute };
    }),
  },
) {}

interface DeleteNoteUseCaseInputModel {
  noteId: string;
}

export const DeleteNoteUseCaseService = DeleteNoteUseCase;
