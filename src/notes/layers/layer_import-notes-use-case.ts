import * as Layer from "effect/Layer";
import {
  ImportNotesUseCase,
  ImportNotesUseCaseService,
} from "../domain/use-cases/import-notes-use-case";

export { ImportNotesUseCaseService };
export const ImportNotesUseCaseLive = Layer.effect(
  ImportNotesUseCaseService,
  ImportNotesUseCase.make,
);
