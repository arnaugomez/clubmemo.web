import * as Context from "effect/Context";
import * as Effect from "effect/Effect";
import { NoPermissionError } from "@/src/common/domain/models/app-errors";
import { CoursesRepository } from "@/src/courses/domain/interfaces/courses-repository";
import { CourseDoesNotExistError } from "@/src/courses/domain/models/course-errors";
import { NotesRepository } from "@/src/notes/domain/interfaces/notes-repository";
import type { NoteRowModel } from "@/src/notes/domain/models/note-row-model";
import { ProfileDoesNotExistError } from "@/src/profile/domain/errors/profile-errors";
import { GetMyProfileUseCase } from "@/src/profile/domain/use-cases/get-my-profile-use-case";

/**
 * Saves the AI-generated notes permanently and adds them to
 * the course, so that the user can practice them later.
 */
export class GenerateAiNotesConfirmUseCase extends Context.Service<GenerateAiNotesConfirmUseCase>()(
  "clubmemo/ai-generator/domain/use-cases/generate-ai-notes-confirm-use-case",
  {
    make: Effect.gen(function* () {
      const getMyProfileUseCase = yield* GetMyProfileUseCase;
      const coursesRepository = yield* CoursesRepository;
      const notesRepository = yield* NotesRepository;
      const execute = Effect.fn("GenerateAiNotesConfirmUseCase.execute")(
        function* (input: GenerateAiNotesConfirmInputModel) {
          const profile = yield* getMyProfileUseCase.execute();
          if (!profile)
            return yield* Effect.fail(new ProfileDoesNotExistError());

          const course = yield* coursesRepository.getDetail({
            id: input.courseId,
            profileId: profile.id,
          });
          if (!course) return yield* Effect.fail(new CourseDoesNotExistError());
          // Before adding the notes, check that the profile has permission to do so
          if (!course.canEdit)
            return yield* Effect.fail(new NoPermissionError());

          yield* notesRepository.createMany(input.courseId, input.notes);
        },
      );
      return { execute };
    }),
  },
) {}

interface GenerateAiNotesConfirmInputModel {
  /**
   * The ID of the course where the notes will be added
   */
  courseId: string;
  /**
   * The notes that will be added to the course
   */
  notes: NoteRowModel[];
}

export const GenerateAiNotesConfirmUseCaseService =
  GenerateAiNotesConfirmUseCase;
