"use server";
import * as Effect from "effect/Effect";
import * as Result from "effect/Result";
import * as Schema from "effect/Schema";
import { revalidatePath } from "next/cache";
import { runServer } from "@/src/common/effect/server-runtime";
import { ActionErrorHandler } from "@/src/common/ui/actions/action-error-handler";
import { ActionResponse } from "@/src/common/ui/models/server-form-errors";
import { PracticeCardModel } from "@/src/practice/domain/models/practice-card-model";
import { ReviewLogModel } from "@/src/practice/domain/models/review-log-model";
import { PracticeUseCaseService } from "@/src/practice/layers/layer_practice-use-case";
import {
  type PracticeActionModel,
  PracticeActionSchema,
} from "../schemas/practice-action-schema";

export async function practiceAction(input: PracticeActionModel) {
  return runServer(
    Effect.gen(function* () {
      {
        const outcome = yield* Effect.result(
          Effect.gen(function* () {
            const parsed =
              yield* Schema.decodeUnknownEffect(PracticeActionSchema)(input);

            const useCase = yield* PracticeUseCaseService;
            const { newCard, newReviewLog } = yield* useCase.execute({
              courseId: parsed.courseId,
              card: new PracticeCardModel(parsed.card),
              reviewLog: new ReviewLogModel(parsed.reviewLog),
            });

            revalidatePath("/");

            return ActionResponse.formSuccess({
              card: newCard.data,
              reviewLog: newReviewLog.data,
            });
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
