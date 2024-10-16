import type { Dependency } from "@/src/common/di/locator-types";
import { locator_profile_GetMyProfileUseCase } from "@/src/profile/locators/locator_get-my-profile-use-case";
import { locator_rateLimits_RateLimitsRepository } from "@/src/rate-limits/locators/locator_rate-limits-repository";
import { GenerateAiNotesUseCase } from "../domain/use-cases/generate-ai-notes-use-case";
import { locator_aiGenerator_AiNotesGeneratorService } from "./locator_ai-notes-generator-service";

export const locator_aiGenerator_GenerateAiNotesUseCase: Dependency<
  GenerateAiNotesUseCase
> = () =>
  new GenerateAiNotesUseCase(
    locator_profile_GetMyProfileUseCase(),
    locator_aiGenerator_AiNotesGeneratorService(),
    locator_rateLimits_RateLimitsRepository(),
  );
