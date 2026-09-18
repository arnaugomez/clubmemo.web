import * as Layer from "effect/Layer";
import {
  UpdateNoteUseCase,
  UpdateNoteUseCaseService,
} from "../domain/use-cases/update-note-use-case";

export { UpdateNoteUseCaseService };
export const UpdateNoteUseCaseLive = Layer.effect(
  UpdateNoteUseCaseService,
  UpdateNoteUseCase.make,
);
