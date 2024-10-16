"use server";

import { ActionErrorHandler } from "@/src/common/ui/actions/action-error-handler";
import { ActionResponse } from "@/src/common/ui/models/server-form-errors";
import { revalidatePath } from "next/cache";
import type { DeleteNoteActionModel } from "../schemas/delete-note-action-schema";
import { DeleteNoteActionSchema } from "../schemas/delete-note-action-schema";
import { locator_notes_DeleteNoteUseCase } from "@/src/notes/locators/locator_delete-note-use-case";

export async function deleteNoteAction(input: DeleteNoteActionModel) {
  try {
    const parsed = DeleteNoteActionSchema.parse(input);

    const useCase = locator_notes_DeleteNoteUseCase();
    await useCase.execute(parsed);

    revalidatePath("/courses/detail");
    return ActionResponse.formSuccess(null);
  } catch (e) {
    return ActionErrorHandler.handle(e);
  }
}
