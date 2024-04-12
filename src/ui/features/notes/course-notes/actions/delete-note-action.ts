"use server";

import { NoPermissionError } from "@/src/core/common/domain/models/app-errors";
import { CourseDoesNotExistError } from "@/src/core/courses/domain/models/course-errors";
import { notesLocator } from "@/src/core/notes/notes-locator";
import { ProfileDoesNotExistError } from "@/src/core/profile/domain/errors/profile-errors";
import { ActionResponse } from "@/src/ui/models/server-form-errors";
import { revalidatePath } from "next/cache";
import { fetchMyProfile } from "../../../profile/fetch/fetch-my-profile";
import {
  DeleteNoteActionModel,
  DeleteNoteActionSchema,
} from "../schemas/delete-note-action-schema";

export async function deleteNoteAction(data: DeleteNoteActionModel) {
  try {
    const { noteId } = DeleteNoteActionSchema.parse(data);
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
    if (e instanceof ProfileDoesNotExistError) {
      return ActionResponse.formGlobalError("profileDoesNotExist");
    } else if (e instanceof CourseDoesNotExistError) {
      return ActionResponse.formGlobalError("courseDoesNotExist");
    } else if (e instanceof NoPermissionError) {
      return ActionResponse.formGlobalError("noPermission");
    }
    // TODO: log error report
    console.error(e);
    return ActionResponse.formGlobalError("general");
  }
}
