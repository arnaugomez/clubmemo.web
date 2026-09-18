import * as Context from "effect/Context";
import * as Effect from "effect/Effect";
import { NotesRepository } from "../interfaces/notes-repository";
import type { GetNotesInputModel } from "../models/get-notes-input-model";

/**
 * Gets a paginated list of the notes of a course
 *
 * @input The course id and a pagination cursor
 * @returns A paginated list of the notes of the course
 */
export class GetNotesUseCase extends Context.Service<GetNotesUseCase>()(
  "clubmemo/notes/domain/use-cases/get-notes-use-case",
  {
    make: Effect.gen(function* () {
      const notesRepository = yield* NotesRepository;
      const execute = Effect.fn("GetNotesUseCase.execute")(function* (
        input: GetNotesInputModel,
      ) {
        return yield* notesRepository.get(input);
      });
      return { execute };
    }),
  },
) {}

export const GetNotesUseCaseService = GetNotesUseCase;
