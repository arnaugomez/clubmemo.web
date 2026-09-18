import * as Layer from "effect/Layer";
import {
  DeleteNoteUseCase,
  DeleteNoteUseCaseService,
} from "../domain/use-cases/delete-note-use-case";

export { DeleteNoteUseCaseService };
export const DeleteNoteUseCaseLive = Layer.effect(
  DeleteNoteUseCaseService,
  DeleteNoteUseCase.make,
);
