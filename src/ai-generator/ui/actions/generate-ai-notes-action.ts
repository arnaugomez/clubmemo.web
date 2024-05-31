"use server";

import { aiGeneratorLocator } from "@/src/ai-generator/ai-generator-locator";
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
  try {
    const parsed = GenerateAiNotesActionSchema.parse(input);

    const useCase = await aiGeneratorLocator.GenerateAiNotesUseCase();
    const result = await useCase.execute(parsed);

    return ActionResponse.formSuccess(result);
  } catch (e) {
    return ActionErrorHandler.handle(e);
  }
}
