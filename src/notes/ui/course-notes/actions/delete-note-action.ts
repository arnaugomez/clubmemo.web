"use server";

import { ActionErrorHandler } from "@/src/common/ui/actions/action-error-handler";
import { ActionResponse } from "@/src/common/ui/models/server-form-errors";
import { notesLocator } from "@/src/notes/notes-locator";
import { revalidatePath } from "next/cache";
import type { DeleteNoteActionModel } from "../schemas/delete-note-action-schema";
import { DeleteNoteActionSchema } from "../schemas/delete-note-action-schema";

export async function deleteNoteAction(input: DeleteNoteActionModel) {
  try {
    const parsed = DeleteNoteActionSchema.parse(input);

    const useCase = await notesLocator.DeleteNoteUseCase();
    await useCase.execute(parsed);

    revalidatePath("/courses/detail");
    return ActionResponse.formSuccess(null);
  } catch (e) {
    return ActionErrorHandler.handle(e);
  }
}
