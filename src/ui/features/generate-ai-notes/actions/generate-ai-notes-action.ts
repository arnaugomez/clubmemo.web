"use server";

import {
  InvalidFileFormatError,
  NoPermissionError,
} from "@/src/core/app/domain/models/app-errors";
import { CourseDoesNotExistError } from "@/src/core/courses/domain/models/course-errors";
import { notesLocator } from "@/src/core/notes/notes-locator";
import { ProfileDoesNotExistError } from "@/src/core/profile/domain/errors/profile-errors";
import { ActionResponse } from "@/src/ui/models/server-form-errors";
import { revalidatePath } from "next/cache";
import { fetchMyProfile } from "../../profile/fetch/fetch-my-profile";
import { GenerateAiNotesActionSchema } from "../generate-ai-notes/generate-ai-notes-action-schema";

export async function generateAiNotesAction(data: FormData) {
  try {
    const profile = await fetchMyProfile();
    if (!profile) throw new ProfileDoesNotExistError();
    const noteTypes = data.get("noteTypes");
    const parsed = GenerateAiNotesActionSchema.parse({
      courseId: data.get("courseId"),
      file: data.get("file"),
      text: data.get("text"),
      noteTypes:
        typeof noteTypes === "string" ? noteTypes.split(",") : noteTypes,
    });
    const text = parsed.text ?? "";
    if (!text && !parsed.file) {
      throw new Error("Either file or text must be provided.");
    }
    if (parsed.file && !parsed.file.type.includes("pdf")) {
      throw new InvalidFileFormatError();
    }
    // TODO: extract text from pdf file

    const useCase = await notesLocator.GenerateAiNotesUseCase();
    const result = await useCase.execute({
      profileId: profile.id,
      courseId: parsed.courseId,
      text,
      noteTypes: parsed.noteTypes,
      notesCount: parsed.notesCount,
    });

    revalidatePath("/courses/detail");
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
