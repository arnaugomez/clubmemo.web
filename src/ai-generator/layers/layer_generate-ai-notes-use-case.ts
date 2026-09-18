import * as Layer from "effect/Layer";
import {
  GenerateAiNotesUseCase,
  GenerateAiNotesUseCaseService,
} from "../domain/use-cases/generate-ai-notes-use-case";

export { GenerateAiNotesUseCaseService };
export const GenerateAiNotesUseCaseLive = Layer.effect(
  GenerateAiNotesUseCaseService,
  GenerateAiNotesUseCase.make,
);
