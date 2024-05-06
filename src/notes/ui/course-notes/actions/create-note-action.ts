"use server";

import { NoPermissionError } from "@/src/common/domain/models/app-errors";
import { ActionResponse } from "@/src/common/ui/models/server-form-errors";
import { CourseDoesNotExistError } from "@/src/courses/domain/models/course-errors";
import { notesLocator } from "@/src/notes/notes-locator";
import { ProfileDoesNotExistError } from "@/src/profile/domain/errors/profile-errors";
import { revalidatePath } from "next/cache";
import { fetchMyProfile } from "../../../../profile/ui/fetch/fetch-my-profile";
import type {
  CreateNoteActionModel} from "../schemas/create-note-action-schema";
import {
  CreateNoteActionSchema,
} from "../schemas/create-note-action-schema";

export async function createNoteAction(data: CreateNoteActionModel) {
  try {
    const values = CreateNoteActionSchema.parse(data);
    const profile = await fetchMyProfile();
    if (!profile) throw new ProfileDoesNotExistError();
    const createNoteUseCase = await notesLocator.CreateNoteUseCase();

    const note = await createNoteUseCase.execute({
      createNoteInput: values,
      profileId: profile.id,
    });

    revalidatePath("/courses/detail");
    return ActionResponse.formSuccess(note.data);
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
