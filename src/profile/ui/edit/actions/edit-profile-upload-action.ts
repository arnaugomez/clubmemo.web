"use server";

import { ActionErrorHandler } from "@/src/common/ui/actions/action-error-handler";
import type { FormActionResponse } from "@/src/common/ui/models/server-form-errors";
import { ActionResponse } from "@/src/common/ui/models/server-form-errors";
import type { CreateFileUploadOutputModel } from "@/src/file-upload/domain/interfaces/file-uploads-repository";
import { profileLocator } from "@/src/profile/profile-locator";
import {
  EditProfileUploadActionSchema,
  type EditProfileUploadActionModel,
} from "../schemas/edit-profile-upload-action-schema";

interface EditProfileUploadActionResult {
  picture?: CreateFileUploadOutputModel;
  backgroundPicture?: CreateFileUploadOutputModel;
}

/**
 * Generates presigned urls to upload the profile picture and background picture
 * of the profile
 *
 * @param input The data of the pictures that need to be uploaded
 */
export async function editProfileUploadAction(
  input: EditProfileUploadActionModel,
): Promise<FormActionResponse<EditProfileUploadActionResult | null>> {
  try {
    const parsed = EditProfileUploadActionSchema.parse(input);
    const useCase = await profileLocator.EditProfileUploadUseCase();
    const [picture, backgroundPicture] = await useCase.execute(parsed);

    return ActionResponse.formSuccess({
      picture,
      backgroundPicture,
    });
  } catch (e) {
    return ActionErrorHandler.handle(e);
  }
}
