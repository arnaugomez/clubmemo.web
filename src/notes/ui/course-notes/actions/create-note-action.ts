"use server";

import { ActionErrorHandler } from "@/src/common/ui/actions/action-error-handler";
import { ActionResponse } from "@/src/common/ui/models/server-form-errors";
import { revalidatePath } from "next/cache";
import type { CreateNoteActionModel } from "../schemas/create-note-action-schema";
import { CreateNoteActionSchema } from "../schemas/create-note-action-schema";
import { locator_notes_CreateNoteUseCase } from "@/src/notes/locators/locator_create-note-use-case";

export async function createNoteAction(input: CreateNoteActionModel) {
  try {
    const parsed = CreateNoteActionSchema.parse(input);

    const createNoteUseCase = locator_notes_CreateNoteUseCase();
    const note = await createNoteUseCase.execute(parsed);

    revalidatePath("/courses/detail");
    return ActionResponse.formSuccess(note.data);
  } catch (e) {
    return ActionErrorHandler.handle(e);
  }
}
