"use server";

import { ActionErrorHandler } from "@/src/common/ui/actions/action-error-handler";
import { ActionResponse } from "@/src/common/ui/models/server-form-errors";
import { notesLocator } from "@/src/notes/notes-locator";
import { ProfileDoesNotExistError } from "@/src/profile/domain/errors/profile-errors";
import { revalidatePath } from "next/cache";
import { fetchMyProfile } from "../../../../profile/ui/fetch/fetch-my-profile";
import type { DeleteNoteActionModel } from "../schemas/delete-note-action-schema";
import { DeleteNoteActionSchema } from "../schemas/delete-note-action-schema";

export async function deleteNoteAction(input: DeleteNoteActionModel) {
  try {
    const { noteId } = DeleteNoteActionSchema.parse(input);

    const profile = await fetchMyProfile();
    if (!profile) throw new ProfileDoesNotExistError();

    const deleteNoteUseCase = await notesLocator.DeleteNoteUseCase();
    await deleteNoteUseCase.execute({
      profileId: profile.id,
      noteId,
    });

    revalidatePath("/courses/detail");
    return ActionResponse.formSuccess(null);
  } catch (e) {
    return ActionErrorHandler.handle(e);
  }
}
