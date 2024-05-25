"use server";

import { ActionErrorHandler } from "@/src/common/ui/actions/action-error-handler";
import { ActionResponse } from "@/src/common/ui/models/server-form-errors";
import { notesLocator } from "@/src/notes/notes-locator";
import { ProfileDoesNotExistError } from "@/src/profile/domain/errors/profile-errors";
import { revalidatePath } from "next/cache";
import { fetchMyProfile } from "../../../../profile/ui/fetch/fetch-my-profile";
import type { EditNoteActionModel } from "../schemas/edit-note-action-schema";
import { EditNoteActionSchema } from "../schemas/edit-note-action-schema";

export async function editNoteAction(input: EditNoteActionModel) {
  try {
    const values = EditNoteActionSchema.parse(input);

    const profile = await fetchMyProfile();
    if (!profile) throw new ProfileDoesNotExistError();

    const updateNoteUseCase = await notesLocator.UpdateNoteUseCase();
    const newNote = await updateNoteUseCase.execute({
      updateNoteInput: values,
      profileId: profile.id,
    });

    revalidatePath("/courses/detail");
    return ActionResponse.formSuccess(newNote?.data);
  } catch (e) {
    return ActionErrorHandler.handle(e);
  }
}
