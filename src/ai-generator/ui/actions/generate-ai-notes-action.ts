"use server";

import { aiGeneratorLocator } from "@/src/ai-generator/ai-generator-locator";
import { ActionErrorHandler } from "@/src/common/ui/actions/action-error-handler";
import { ActionResponse } from "@/src/common/ui/models/server-form-errors";
import type { GenerateAiNotesActionModel } from "../schemas/generate-ai-notes-action-schema";
import { GenerateAiNotesActionSchema } from "../schemas/generate-ai-notes-action-schema";

export async function generateAiNotesAction(input: GenerateAiNotesActionModel) {
  try {
    const parsed = GenerateAiNotesActionSchema.parse(input);

    const useCase = await aiGeneratorLocator.GenerateAiNotesUseCase();
    const result = await useCase.execute({
      text: parsed.text,
      noteTypes: parsed.noteTypes,
      notesCount: parsed.notesCount,
      sourceType: parsed.sourceType,
    });

    return ActionResponse.formSuccess(result);
  } catch (e) {
    return ActionErrorHandler.handle(e);
  }
}
