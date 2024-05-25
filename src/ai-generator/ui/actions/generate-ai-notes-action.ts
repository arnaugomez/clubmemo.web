"use server";

import { aiGeneratorLocator } from "@/src/ai-generator/ai-generator-locator";
import { InvalidFileFormatError } from "@/src/common/domain/models/app-errors";
import { ActionErrorHandler } from "@/src/common/ui/actions/action-error-handler";
import { ActionResponse } from "@/src/common/ui/models/server-form-errors";
import type { GenerateAiNotesActionModel } from "../schemas/generate-ai-notes-action-schema";
import { GenerateAiNotesActionSchema } from "../schemas/generate-ai-notes-action-schema";

export async function generateAiNotesAction(input: GenerateAiNotesActionModel) {
  try {
    const parsed = GenerateAiNotesActionSchema.parse(input);

    const useCase = await aiGeneratorLocator.GenerateAiNotesUseCase();
    const result = await useCase.execute({
      courseId: parsed.courseId,
      text: parsed.text,
      noteTypes: parsed.noteTypes,
      notesCount: parsed.notesCount,
      sourceType: parsed.sourceType,
    });

    return ActionResponse.formSuccess(result);
  } catch (e) {
    if (e instanceof InvalidFileFormatError) {
      return ActionResponse.formError("file", {
        type: "invalidFileFormat",
        message: "Invalid file format.",
      });
    }
    return ActionErrorHandler.handle(e);
  }
}
