import type { Lazy} from "../common/locator";
import { locator } from "../common/locator";
import type { GenerateAiNotesUseCase } from "./domain/use-cases/generate-ai-notes-use-case";

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
