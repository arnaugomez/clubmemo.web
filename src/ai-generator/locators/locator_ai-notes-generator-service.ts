import type { Dependency } from "@/src/common/di/locator-types";
import { locator_common_EnvService } from "@/src/common/locators/locator_env-service";
import { locator_common_ErrorTrackingService } from "@/src/common/locators/locator_error-tracking-service";
import { AiNotesGeneratorServiceFakeImpl } from "../../ai-generator/data/services/ai-notes-generator-service-fake-impl";
import { AiNotesGeneratorServiceOpenaiImpl } from "../../ai-generator/data/services/ai-notes-generator-service-openai-impl";
import type { AiNotesGeneratorService } from "../domain/interfaces/ai-notes-generator-service";

export const locator_aiGenerator_AiNotesGeneratorService: Dependency<
  AiNotesGeneratorService
> = () => {
  const envService = locator_common_EnvService();
  if (envService.fakeOpenAiApi) {
    return new AiNotesGeneratorServiceFakeImpl();
  }
  return new AiNotesGeneratorServiceOpenaiImpl(
    envService,
    locator_common_ErrorTrackingService(),
  );
};
