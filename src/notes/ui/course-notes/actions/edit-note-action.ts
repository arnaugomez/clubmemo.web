"use server";

import { ActionErrorHandler } from "@/src/common/ui/actions/action-error-handler";
import { ActionResponse } from "@/src/common/ui/models/server-form-errors";
import { revalidatePath } from "next/cache";
import type { EditNoteActionModel } from "../schemas/edit-note-action-schema";
import { EditNoteActionSchema } from "../schemas/edit-note-action-schema";
import { locator_notes_UpdateNoteUseCase } from "@/src/notes/locators/locator_update-note-use-case";

export async function editNoteAction(input: EditNoteActionModel) {
  try {
    const parsed = EditNoteActionSchema.parse(input);

    const updateNoteUseCase = locator_notes_UpdateNoteUseCase();
    const newNote = await updateNoteUseCase.execute(parsed);

    revalidatePath("/courses/detail");
    return ActionResponse.formSuccess(newNote?.data);
  } catch (e) {
    return ActionErrorHandler.handle(e);
  }
}
