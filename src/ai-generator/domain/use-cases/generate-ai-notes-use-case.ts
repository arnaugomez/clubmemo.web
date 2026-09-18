import * as Context from "effect/Context";
import * as Effect from "effect/Effect";
import {
  AiNotesGeneratorService,
  type GenerateAiNotesInputModel,
} from "@/src/ai-generator/domain/interfaces/ai-notes-generator-service";
import { ProfileDoesNotExistError } from "@/src/profile/domain/errors/profile-errors";
import { GetMyProfileUseCase } from "@/src/profile/domain/use-cases/get-my-profile-use-case";
import { RateLimitsRepository } from "@/src/rate-limits/domain/interfaces/rate-limits-repository";

/**
 * Creates a list of AI-generated notes that the user can add to the course.
 *
 * This use case is rate-limited to 50 requests/profile-day.
 */
export class GenerateAiNotesUseCase extends Context.Service<GenerateAiNotesUseCase>()(
  "clubmemo/ai-generator/domain/use-cases/generate-ai-notes-use-case",
  {
    make: Effect.gen(function* () {
      const getMyProfileUseCase = yield* GetMyProfileUseCase;
      const aiNotesGeneratorService = yield* AiNotesGeneratorService;
      const rateLimitsRepository = yield* RateLimitsRepository;
      const execute = Effect.fn("GenerateAiNotesUseCase.execute")(function* ({
        ...input
      }: GenerateAiNotesInputModel) {
        const profile = yield* getMyProfileUseCase.execute();
        if (!profile) return yield* Effect.fail(new ProfileDoesNotExistError());

        const rateLimitKey = `GenerateAiNotesUseCase/${profile.id}`;

        yield* rateLimitsRepository.check(rateLimitKey, 50);

        const generated = yield* aiNotesGeneratorService.generate(input);
        yield* rateLimitsRepository.increment(rateLimitKey);
        return generated;
      });
      return { execute };
    }),
  },
) {}

export const GenerateAiNotesUseCaseService = GenerateAiNotesUseCase;
