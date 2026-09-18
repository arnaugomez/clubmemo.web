"use server";
import * as Effect from "effect/Effect";
import * as Result from "effect/Result";
import * as Schema from "effect/Schema";
import { runServer } from "@/src/common/effect/server-runtime";

import { ActionErrorHandler } from "@/src/common/ui/actions/action-error-handler";
import { ActionResponse } from "@/src/common/ui/models/server-form-errors";
import { GetNextPracticeCardsUseCaseService } from "@/src/practice/layers/layer_get-next-practice-cards-use-case";
import type { GetNextPracticeCardsActionModel } from "../schemas/get-next-practice-cards-action-schema";
import { GetNextPracticeCardsActionSchema } from "../schemas/get-next-practice-cards-action-schema";

export async function getNextPracticeCardsAction(
  input: GetNextPracticeCardsActionModel,
) {
  return runServer(
    Effect.gen(function* () {
      {
        const outcome = yield* Effect.result(
          Effect.gen(function* () {
            const parsed = yield* Schema.decodeUnknownEffect(
              GetNextPracticeCardsActionSchema,
            )(input);

            const useCase = yield* GetNextPracticeCardsUseCaseService;
            const cards = yield* useCase.execute(parsed);

            return ActionResponse.formSuccess(cards.map((c) => c.data));
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
