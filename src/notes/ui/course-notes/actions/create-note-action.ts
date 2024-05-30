"use server";

import { ActionErrorHandler } from "@/src/common/ui/actions/action-error-handler";
import { ActionResponse } from "@/src/common/ui/models/server-form-errors";
import { notesLocator } from "@/src/notes/notes-locator";
import { revalidatePath } from "next/cache";
import type { CreateNoteActionModel } from "../schemas/create-note-action-schema";
import { CreateNoteActionSchema } from "../schemas/create-note-action-schema";

export async function createNoteAction(input: CreateNoteActionModel) {
  try {
    const parsed = CreateNoteActionSchema.parse(input);

    const createNoteUseCase = await notesLocator.CreateNoteUseCase();
    const note = await createNoteUseCase.execute(parsed);

    revalidatePath("/courses/detail");
    return ActionResponse.formSuccess(note.data);
  } catch (e) {
    return ActionErrorHandler.handle(e);
  }
}
