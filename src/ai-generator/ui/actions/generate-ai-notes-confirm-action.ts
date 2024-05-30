"use server";

import { ActionErrorHandler } from "@/src/common/ui/actions/action-error-handler";
import { ActionResponse } from "@/src/common/ui/models/server-form-errors";
import { revalidatePath } from "next/cache";
import { aiGeneratorLocator } from "../../ai-generator-locator";
import type { GenerateAiNotesConfirmActionModel } from "../schemas/generate-ai-notes-confirm-action-schema";
import { GenerateAiNotesConfirmActionSchema } from "../schemas/generate-ai-notes-confirm-action-schema";

export async function generateAiNotesConfirmAction(
  data: GenerateAiNotesConfirmActionModel,
) {
  try {
    const parsed = GenerateAiNotesConfirmActionSchema.parse(data);

    const useCase = await aiGeneratorLocator.GenerateAiNotesConfirmUseCase();
    await useCase.execute(parsed);

    revalidatePath("/courses/detail");

    return ActionResponse.formSuccess(null);
  } catch (e) {
    return ActionErrorHandler.handle(e);
  }
}
