"use server";

import { ActionErrorHandler } from "@/src/common/ui/actions/action-error-handler";
import { ActionResponse } from "@/src/common/ui/models/server-form-errors";
import { revalidatePath } from "next/cache";
import { locator_aiGenerator_GenerateAiNotesConfirmUseCase } from "../../locators/locator_generate-ai-notes-confirm-use-case";
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
  try {
    const parsed = GenerateAiNotesConfirmActionSchema.parse(input);

    const useCase = locator_aiGenerator_GenerateAiNotesConfirmUseCase();
    await useCase.execute(parsed);

    revalidatePath("/courses/detail");

    return ActionResponse.formSuccess(null);
  } catch (e) {
    return ActionErrorHandler.handle(e);
  }
}
