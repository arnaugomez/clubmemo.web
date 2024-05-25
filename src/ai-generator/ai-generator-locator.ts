import type { Lazy } from "../common/locator";
import { locator } from "../common/locator";
import { profileLocator } from "../profile/profile-locator";
import type { GenerateAiNotesUseCase } from "./domain/use-cases/generate-ai-notes-use-case";

interface AiGeneratorLocator {
  GenerateAiNotesUseCase: Lazy<GenerateAiNotesUseCase>;
}

export const aiGeneratorLocator: AiGeneratorLocator = {
  GenerateAiNotesUseCase: async () => {
    const file = await import("./domain/use-cases/generate-ai-notes-use-case");
    return new file.GenerateAiNotesUseCase(
      await profileLocator.GetMyProfileUseCase(),
      await locator.CoursesRepository(),
      await locator.AiNotesGeneratorService(),
      locator.RateLimitsRepository(),
    );
  },
};
