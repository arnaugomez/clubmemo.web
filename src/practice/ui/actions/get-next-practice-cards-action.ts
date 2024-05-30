"use server";

import { ActionErrorHandler } from "@/src/common/ui/actions/action-error-handler";
import { ActionResponse } from "@/src/common/ui/models/server-form-errors";
import { practiceLocator } from "../../practice-locator";
import type { GetNextPracticeCardsActionModel } from "../schemas/get-next-practice-cards-action-schema";
import { GetNextPracticeCardsActionSchema } from "../schemas/get-next-practice-cards-action-schema";

export async function getNextPracticeCardsAction(
  input: GetNextPracticeCardsActionModel,
) {
  try {
    const parsed = GetNextPracticeCardsActionSchema.parse(input);

    const useCase = await practiceLocator.GetNextPracticeCardsUseCase();
    const cards = await useCase.execute(parsed);

    return ActionResponse.formSuccess(cards.map((c) => c.data));
  } catch (e) {
    return ActionErrorHandler.handle(e);
  }
}
