"use server";

import { locator } from "@/src/common/locator";
import type { FormActionResponse } from "@/src/common/ui/models/server-form-errors";
import { ActionResponse } from "@/src/common/ui/models/server-form-errors";
import type { PresignedUrlModel } from "@/src/file-upload/domain/models/presigned-url-model";
import { ProfileDoesNotExistError } from "@/src/profile/domain/errors/profile-errors";
import { fetchMyProfile } from "../../fetch/fetch-my-profile";

interface EditProfileUploadActionData {
  pictureContentType: string;
  backgroundPictureContentType: string;
  uploadPicture: boolean;
  uploadBackgroundPicture: boolean;
}

interface EditProfileUploadActionResult {
  picture?: PresignedUrlModel;
  backgroundPicture?: PresignedUrlModel;
}

export async function editProfileUploadAction({
  pictureContentType,
  backgroundPictureContentType,
  uploadPicture,
  uploadBackgroundPicture,
}: EditProfileUploadActionData): Promise<
  FormActionResponse<EditProfileUploadActionResult | null>
> {
  try {
    const profile = await fetchMyProfile();
    if (!profile) throw new ProfileDoesNotExistError();
    const fileUploadService = await locator.FileUploadService();

    const [picture, backgroundPicture] = await Promise.all([
      uploadPicture
        ? fileUploadService.generatePresignedUrl({
            key: `profile/picture/${profile.id}`,
            contentType: pictureContentType,
          })
        : undefined,
      uploadBackgroundPicture
        ? fileUploadService.generatePresignedUrl({
            key: `profile/backgroundPicture/${profile.id}`,
            contentType: backgroundPictureContentType,
          })
        : undefined,
    ]);

    return ActionResponse.formSuccess({
      picture,
      backgroundPicture,
    });
  } catch (e) {
    if (e instanceof ProfileDoesNotExistError) {
      return ActionResponse.formGlobalError("profileDoesNotExist");
    } else {
      // TODO: log error report
      console.error(e);
      return ActionResponse.formGlobalError("general");
    }
  }
}
