"use server";

import { ActionErrorHandler } from "@/src/common/ui/actions/action-error-handler";
import { ActionResponse } from "@/src/common/ui/models/server-form-errors";
import { PracticeCardModel } from "@/src/practice/domain/models/practice-card-model";
import { ReviewLogModel } from "@/src/practice/domain/models/review-log-model";
import { practiceLocator } from "../../practice-locator";
import {
  PracticeActionSchema,
  type PracticeActionModel,
} from "../schemas/practice-action-schema";

export async function practiceAction(input: PracticeActionModel) {
  try {
    const parsed = PracticeActionSchema.parse(input);

    const useCase = await practiceLocator.PracticeUseCase();
    const { newCard, newReviewLog } = await useCase.execute({
      courseId: parsed.courseId,
      card: new PracticeCardModel(parsed.card),
      reviewLog: new ReviewLogModel(parsed.reviewLog),
    });

    return ActionResponse.formSuccess({
      card: newCard.data,
      reviewLog: newReviewLog.data,
    });
  } catch (e) {
    return ActionErrorHandler.handle(e);
  }
}
