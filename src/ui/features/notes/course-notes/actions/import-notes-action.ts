"use server";

import {
  InvalidFileFormatError,
  NoPermissionError,
} from "@/src/core/app/domain/models/app-errors";
import { CourseDoesNotExistError } from "@/src/core/courses/domain/models/course-errors";
import { notesLocator } from "@/src/core/notes/notes-locator";
import { ProfileDoesNotExistError } from "@/src/core/profile/domain/errors/profile-errors";
import { ActionResponse } from "@/src/ui/models/server-form-errors";
import { fetchMyProfile } from "../../../profile/fetch/fetch-my-profile";
import { ImportNotesActionSchema } from "../schemas/import-notes-action-schema";

export async function importNotesAction(data: FormData) {
  try {
    const profile = await fetchMyProfile();
    if (!profile) throw new ProfileDoesNotExistError();
    const parsed = ImportNotesActionSchema.parse({
      file: data.get("file"),
      courseId: data.get("courseId"),
      importType: data.get("importType"),
    });
    const importNotesUseCase = await notesLocator.ImportNotesUseCase();
    const result = await importNotesUseCase.execute({
      profileId: profile.id,
      courseId: parsed.courseId,
      file: parsed.file,
      importType: parsed.importType,
    });

    return ActionResponse.formSuccess(result.map((e) => e.data));
  } catch (e) {
    if (e instanceof ProfileDoesNotExistError) {
      return ActionResponse.formGlobalError("profileDoesNotExist");
    } else if (e instanceof CourseDoesNotExistError) {
      return ActionResponse.formGlobalError("courseDoesNotExist");
    } else if (e instanceof NoPermissionError) {
      return ActionResponse.formGlobalError("noPermission");
    } else if (e instanceof InvalidFileFormatError) {
      return ActionResponse.formError({
        name: "file",
        type: "invalidFileFormat",
        message: "Invalid file format.",
      });
    }
    // TODO: log error report
    console.error(e);
    return ActionResponse.formGlobalError("general");
  }
}
