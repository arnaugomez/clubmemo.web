"use server";
import * as Effect from "effect/Effect";
import * as Result from "effect/Result";
import * as Schema from "effect/Schema";
import { revalidatePath } from "next/cache";
import { GenerateAiNotesConfirmUseCaseService } from "@/src/ai-generator/layers/layer_generate-ai-notes-confirm-use-case";
import { runServer } from "@/src/common/effect/server-runtime";
import { ActionErrorHandler } from "@/src/common/ui/actions/action-error-handler";
import { ActionResponse } from "@/src/common/ui/models/server-form-errors";
import type { GenerateAiNotesConfirmActionModel } from "../schemas/generate-ai-notes-confirm-action-schema";
import { GenerateAiNotesConfirmActionSchema } from "../schemas/generate-ai-notes-confirm-action-schema";

/**
 * Approves the AI-generated notes and adds them to the course so that the user
 * can practice them later
 *
 * @param input Data containing the course id and a list of notes to add to the
 * course
 * @returns A success response or an error
 */
export async function generateAiNotesConfirmAction(
  input: GenerateAiNotesConfirmActionModel,
) {
  return runServer(
    Effect.gen(function* () {
      {
        const outcome = yield* Effect.result(
          Effect.gen(function* () {
            const parsed = yield* Schema.decodeUnknownEffect(
              GenerateAiNotesConfirmActionSchema,
            )(input);

            const useCase = yield* GenerateAiNotesConfirmUseCaseService;
            yield* useCase.execute(parsed);

            revalidatePath("/courses/detail");

            return ActionResponse.formSuccess(null);
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
