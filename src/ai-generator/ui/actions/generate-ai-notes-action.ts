"use server";

import { aiGeneratorLocator } from "@/src/ai-generator/ai-generator-locator";
import {
  InvalidFileFormatError,
  NoPermissionError,
} from "@/src/common/domain/models/app-errors";
import { ActionResponse } from "@/src/common/ui/models/server-form-errors";
import { CourseDoesNotExistError } from "@/src/courses/domain/models/course-errors";
import { ProfileDoesNotExistError } from "@/src/profile/domain/errors/profile-errors";
import { fetchMyProfile } from "../../../profile/ui/fetch/fetch-my-profile";
import type { GenerateAiNotesActionModel } from "../schemas/generate-ai-notes-action-schema";
import { GenerateAiNotesActionSchema } from "../schemas/generate-ai-notes-action-schema";

export async function generateAiNotesAction(data: GenerateAiNotesActionModel) {
  try {
    const profile = await fetchMyProfile();
    if (!profile) throw new ProfileDoesNotExistError();
    const parsed = GenerateAiNotesActionSchema.parse(data);

    const useCase = await aiGeneratorLocator.GenerateAiNotesUseCase();
    const result = await useCase.execute({
      profileId: profile.id,
      courseId: parsed.courseId,
      text: parsed.text,
      noteTypes: parsed.noteTypes,
      notesCount: parsed.notesCount,
      sourceType: parsed.sourceType,
    });

    return ActionResponse.formSuccess(result);
  } catch (e) {
    if (e instanceof ProfileDoesNotExistError) {
      return ActionResponse.formGlobalError("profileDoesNotExist");
    } else if (e instanceof CourseDoesNotExistError) {
      return ActionResponse.formGlobalError("courseDoesNotExist");
    } else if (e instanceof NoPermissionError) {
      return ActionResponse.formGlobalError("noPermission");
    } else if (e instanceof InvalidFileFormatError) {
      return ActionResponse.formError("file", {
        type: "invalidFileFormat",
        message: "Invalid file format.",
      });
    }
    // TODO: log error report
    console.error(e);
    return ActionResponse.formGlobalError("general");
  }
}
