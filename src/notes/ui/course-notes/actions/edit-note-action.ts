"use server";

import { ActionErrorHandler } from "@/src/common/ui/actions/action-error-handler";
import { ActionResponse } from "@/src/common/ui/models/server-form-errors";
import { notesLocator } from "@/src/notes/notes-locator";
import { revalidatePath } from "next/cache";
import type { EditNoteActionModel } from "../schemas/edit-note-action-schema";
import { EditNoteActionSchema } from "../schemas/edit-note-action-schema";

export async function editNoteAction(input: EditNoteActionModel) {
  try {
    const parsed = EditNoteActionSchema.parse(input);

    const updateNoteUseCase = await notesLocator.UpdateNoteUseCase();
    const newNote = await updateNoteUseCase.execute(parsed);

    revalidatePath("/courses/detail");
    return ActionResponse.formSuccess(newNote?.data);
  } catch (e) {
    return ActionErrorHandler.handle(e);
  }
}
