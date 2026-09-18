"use server";
import * as Effect from "effect/Effect";
import * as Result from "effect/Result";
import * as Schema from "effect/Schema";
import { GenerateAiNotesUseCaseService } from "@/src/ai-generator/layers/layer_generate-ai-notes-use-case";
import { runServer } from "@/src/common/effect/server-runtime";
import { ActionErrorHandler } from "@/src/common/ui/actions/action-error-handler";
import { ActionResponse } from "@/src/common/ui/models/server-form-errors";
import type { GenerateAiNotesActionModel } from "../schemas/generate-ai-notes-action-schema";
import { GenerateAiNotesActionSchema } from "../schemas/generate-ai-notes-action-schema";

/**
 * Creates a list of notes automatically with the AI generator.
 *
 * @param input Parameters to fine-tune the AI notes generation process
 * @returns A list of generated notes or an error
 */
export async function generateAiNotesAction(input: GenerateAiNotesActionModel) {
  return runServer(
    Effect.gen(function* () {
      {
        const outcome = yield* Effect.result(
          Effect.gen(function* () {
            const parsed = yield* Schema.decodeUnknownEffect(
              GenerateAiNotesActionSchema,
            )(input);

            const useCase = yield* GenerateAiNotesUseCaseService;
            const result = yield* useCase.execute(parsed);

            return ActionResponse.formSuccess(result);
          }),
        );
        if (Result.isFailure(outcome)) {
          const e = outcome.failure;
          return ActionErrorHandler.handle(e);
        } else {
          return outcome.success;
        }
      }
    }),
  );
}
