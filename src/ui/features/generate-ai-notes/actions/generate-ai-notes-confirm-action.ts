"use server";

import { NoPermissionError } from "@/src/core/app/domain/models/app-errors";
import { locator } from "@/src/core/app/locator";
import { CourseDoesNotExistError } from "@/src/core/courses/domain/models/course-errors";
import { ProfileDoesNotExistError } from "@/src/core/profile/domain/errors/profile-errors";
import { ActionResponse } from "@/src/ui/models/server-form-errors";
import { revalidatePath } from "next/cache";
import { fetchMyProfile } from "../../profile/fetch/fetch-my-profile";
import {
  GenerateAiNotesConfirmActionModel,
  GenerateAiNotesConfirmActionSchema,
} from "../generate-ai-notes/generate-ai-notes-confirm-action-schema";

export async function generateAiNotesConfirmAction(
  data: GenerateAiNotesConfirmActionModel,
) {
  try {
    const parsed = GenerateAiNotesConfirmActionSchema.parse(data);
    const profile = await fetchMyProfile();
    if (!profile) throw new ProfileDoesNotExistError();
    const coursesRepository = await locator.CoursesRepository();
    const course = await coursesRepository.getDetail({
      id: parsed.courseId,
      profileId: profile.id,
    });
    if (!course) throw new CourseDoesNotExistError();
    if (!course.canEdit) throw new NoPermissionError();

    const notesRepository = await locator.NotesRepository();
    await notesRepository.createMany(parsed.courseId, parsed.notes);

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
