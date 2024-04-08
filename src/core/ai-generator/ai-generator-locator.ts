import { Lazy, locator } from "../app/locator";
import { GenerateAiNotesUseCase } from "./domain/use-cases/generate-ai-notes-use-case";

interface AiGeneratorLocator {
  GenerateAiNotesUseCase: Lazy<GenerateAiNotesUseCase>;
}

export const aiGeneratorLocator: AiGeneratorLocator = {
  GenerateAiNotesUseCase: async () => {
    const file = await import("./domain/use-cases/generate-ai-notes-use-case");
    return new file.GenerateAiNotesUseCase(
      await locator.CoursesRepository(),
      await locator.AiNotesGeneratorService(),
    );
  },
};
