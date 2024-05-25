"use server";

import { locator } from "@/src/common/locator";
import { ActionErrorHandler } from "@/src/common/ui/actions/action-error-handler";
import type { FormActionResponse } from "@/src/common/ui/models/server-form-errors";
import { ActionResponse } from "@/src/common/ui/models/server-form-errors";
import type { CreateFileUploadOutputModel } from "@/src/file-upload/domain/interfaces/file-uploads-repository";
import { ProfileDoesNotExistError } from "@/src/profile/domain/errors/profile-errors";
import { fetchMyProfile } from "../../fetch/fetch-my-profile";
import {
  EditProfileUploadActionSchema,
  type EditProfileUploadActionModel,
} from "../schemas/edit-profile-upload-action-schema";

interface EditProfileUploadActionResult {
  picture?: CreateFileUploadOutputModel;
  backgroundPicture?: CreateFileUploadOutputModel;
}

export async function editProfileUploadAction(
  input: EditProfileUploadActionModel,
): Promise<FormActionResponse<EditProfileUploadActionResult | null>> {
  let rateLimitKey = "";
  try {
    const {
      uploadPicture,
      pictureContentType,
      uploadBackgroundPicture,
      backgroundPictureContentType,
    } = EditProfileUploadActionSchema.parse(input);

    const profile = await fetchMyProfile();
    if (!profile) throw new ProfileDoesNotExistError();

    rateLimitKey = `editProfileUploadAction/${profile.id}`;
    const rateLimitsRepository = locator.RateLimitsRepository();
    if (uploadPicture || uploadBackgroundPicture) {
      await rateLimitsRepository.check(rateLimitKey, 40);
      await rateLimitsRepository.increment(rateLimitKey);
    }

    const repository = await locator.FileUploadsRepository();
    const [picture, backgroundPicture] = await Promise.all([
      uploadPicture
        ? repository.create({
            keyPrefix: `profile/picture/${profile.id}`,
            fileName: "picture",
            contentType: pictureContentType,
          })
        : undefined,
      uploadBackgroundPicture
        ? repository.create({
            keyPrefix: `profile/background-picture/${profile.id}`,
            fileName: "background-picture",
            contentType: backgroundPictureContentType,
          })
        : undefined,
    ]);

    return ActionResponse.formSuccess({
      picture,
      backgroundPicture,
    });
  } catch (e) {
    return ActionErrorHandler.handle(e);
  }
}
