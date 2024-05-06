"use server";

import type { PresignedUrlModelData } from "@/src/common/domain/models/presigned-url-model";
import { locator } from "@/src/common/locator";
import type {
  FormActionResponse} from "@/src/common/ui/models/server-form-errors";
import {
  ActionResponse
} from "@/src/common/ui/models/server-form-errors";
import { ProfileDoesNotExistError } from "@/src/profile/domain/errors/profile-errors";
import { fetchMyProfile } from "../../fetch/fetch-my-profile";

interface EditProfileUploadActionData {
  pictureContentType: string;
  backgroundPictureContentType: string;
  uploadPicture: boolean;
  uploadBackgroundPicture: boolean;
}

interface EditProfileUploadActionResult {
  picture?: PresignedUrlModelData;
  backgroundPicture?: PresignedUrlModelData;
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
    const uploadFileService = await locator.UploadFileService();

    const [picture, backgroundPicture] = await Promise.all([
      uploadPicture
        ? uploadFileService.generatePresignedUrl({
            key: `profile/picture/${profile.id}`,
            contentType: pictureContentType,
          })
        : null,
      uploadBackgroundPicture
        ? uploadFileService.generatePresignedUrl({
            key: `profile/backgroundPicture/${profile.id}`,
            contentType: backgroundPictureContentType,
          })
        : null,
    ]);

    return ActionResponse.formSuccess({
      picture: picture?.data,
      backgroundPicture: backgroundPicture?.data,
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
