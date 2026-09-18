import * as Layer from "effect/Layer";
import {
  CreateNoteUseCase,
  CreateNoteUseCaseService,
} from "../domain/use-cases/create-note-use-case";

export { CreateNoteUseCaseService };
export const CreateNoteUseCaseLive = Layer.effect(
  CreateNoteUseCaseService,
  CreateNoteUseCase.make,
);
