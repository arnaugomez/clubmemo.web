import { locator } from "../common/di/locator";
import type { Lazy } from "../common/di/locator-types";
import { profileLocator } from "../profile/profile-locator";
import type { GenerateAiNotesConfirmUseCase } from "./domain/use-cases/generate-ai-notes-confirm-use-case";
import type { GenerateAiNotesUseCase } from "./domain/use-cases/generate-ai-notes-use-case";

/**
 * Service locator for AI generator module.
 */
interface AiGeneratorLocator {
  GenerateAiNotesUseCase: Lazy<GenerateAiNotesUseCase>;
  GenerateAiNotesConfirmUseCase: Lazy<GenerateAiNotesConfirmUseCase>;
}

/**
 * Service locator for the AI generator module.
 */
export const aiGeneratorLocator: AiGeneratorLocator = {
  GenerateAiNotesUseCase: async () => {
    const file = await import("./domain/use-cases/generate-ai-notes-use-case");
    return new file.GenerateAiNotesUseCase(
      await profileLocator.GetMyProfileUseCase(),
      await locator.AiNotesGeneratorService(),
      locator.RateLimitsRepository(),
    );
  },
  async GenerateAiNotesConfirmUseCase() {
    const file = await import(
      "./domain/use-cases/generate-ai-notes-confirm-use-case"
    );
    return new file.GenerateAiNotesConfirmUseCase(
      await profileLocator.GetMyProfileUseCase(),
      await locator.CoursesRepository(),
      await locator.NotesRepository(),
    );
  },
};
