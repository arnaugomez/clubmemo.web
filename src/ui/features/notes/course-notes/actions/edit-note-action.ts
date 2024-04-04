"use server";

import { notesLocator } from "@/src/core/notes/notes-locator";
import { ProfileDoesNotExistError } from "@/src/core/profile/domain/errors/profile-errors";
import { ActionResponse } from "@/src/ui/view-models/server-form-errors";
import { revalidatePath } from "next/cache";
import { fetchMyProfile } from "../../../profile/fetch/fetch-my-profile";
import {
  EditNoteActionModel,
  EditNoteActionSchema,
} from "../schemas/edit-note-action-schema";
import { CourseDoesNotExistError } from "@/src/core/courses/domain/models/course-errors";
import { NoPermissionError } from "@/src/core/app/domain/models/app-errors";

export async function editNoteAction(data: EditNoteActionModel) {
  try {
    const values = EditNoteActionSchema.parse(data);
    const profile = await fetchMyProfile();
    if (!profile) throw new ProfileDoesNotExistError();

    const updateNoteUseCase = await notesLocator.UpdateNoteUseCase();
    await updateNoteUseCase.execute({
      updateNoteInput: values,
      profileId: profile.id,
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
