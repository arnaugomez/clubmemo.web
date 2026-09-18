import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import { EnvService } from "@/src/common/layers/layer_env-service";
import { ErrorTrackingService } from "@/src/common/layers/layer_error-tracking-service";
import { AiNotesGeneratorServiceFakeImpl } from "../../ai-generator/data/services/ai-notes-generator-service-fake-impl";
import { AiNotesGeneratorServiceOpenaiImpl } from "../../ai-generator/data/services/ai-notes-generator-service-openai-impl";
import { AiNotesGeneratorService } from "../domain/interfaces/ai-notes-generator-service";

export { AiNotesGeneratorService };
export const AiNotesGeneratorServiceLive = Layer.effect(
  AiNotesGeneratorService,
  Effect.gen(function* () {
    const envService = yield* EnvService;
    if (envService.fakeOpenAiApi) {
      return new AiNotesGeneratorServiceFakeImpl();
    }
    return new AiNotesGeneratorServiceOpenaiImpl(
      envService,
      yield* ErrorTrackingService,
    );
  }),
);
