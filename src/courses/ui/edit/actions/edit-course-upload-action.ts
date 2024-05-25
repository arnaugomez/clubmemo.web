"use server";

import { ActionErrorHandler } from "@/src/common/ui/actions/action-error-handler";
import type { FormActionResponse } from "@/src/common/ui/models/server-form-errors";
import { ActionResponse } from "@/src/common/ui/models/server-form-errors";
import { coursesLocator } from "@/src/courses/courses-locator";
import type { CreateFileUploadOutputModel } from "@/src/file-upload/domain/interfaces/file-uploads-repository";
import type { EditCourseUploadActionModel } from "../schemas/edit-course-upload-action-schema";
import { EditCourseUploadActionSchema } from "../schemas/edit-course-upload-action-schema";

interface EditCourseUploadActionResult {
  picture?: CreateFileUploadOutputModel;
}

export async function editCourseUploadAction(
  input: EditCourseUploadActionModel,
): Promise<FormActionResponse<EditCourseUploadActionResult | null>> {
  try {
    const parsed = EditCourseUploadActionSchema.parse(input);
    const useCase = await coursesLocator.EditCourseUploadUseCase();
    const picture = await useCase.execute(parsed);

    return ActionResponse.formSuccess({
      picture,
    });
  } catch (e) {
    return ActionErrorHandler.handle(e);
  }
}
