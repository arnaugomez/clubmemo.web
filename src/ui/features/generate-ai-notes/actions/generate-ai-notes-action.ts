"use server";

import { aiGeneratorLocator } from "@/src/core/ai-generator/ai-generator-locator";
import {
  InvalidFileFormatError,
  NoPermissionError,
} from "@/src/core/common/domain/models/app-errors";
import { CourseDoesNotExistError } from "@/src/core/courses/domain/models/course-errors";
import { ProfileDoesNotExistError } from "@/src/core/profile/domain/errors/profile-errors";
import { ActionResponse } from "@/src/ui/models/server-form-errors";
import { fetchMyProfile } from "../../profile/fetch/fetch-my-profile";
import {
  GenerateAiNotesActionModel,
  GenerateAiNotesActionSchema,
} from "../schemas/generate-ai-notes-action-schema";

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
