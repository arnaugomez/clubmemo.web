import * as Layer from "effect/Layer";
import {
  GenerateAiNotesConfirmUseCase,
  GenerateAiNotesConfirmUseCaseService,
} from "../domain/use-cases/generate-ai-notes-confirm-use-case";

export { GenerateAiNotesConfirmUseCaseService };
export const GenerateAiNotesConfirmUseCaseLive = Layer.effect(
  GenerateAiNotesConfirmUseCaseService,
  GenerateAiNotesConfirmUseCase.make,
);
