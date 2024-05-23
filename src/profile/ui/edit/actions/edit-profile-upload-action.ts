"use server";

import { locator } from "@/src/common/locator";
import type { FormActionResponse } from "@/src/common/ui/models/server-form-errors";
import { ActionResponse } from "@/src/common/ui/models/server-form-errors";
import type { CreateFileUploadOutputModel } from "@/src/file-upload/domain/interfaces/file-uploads-repository";
import { ProfileDoesNotExistError } from "@/src/profile/domain/errors/profile-errors";
import { fetchMyProfile } from "../../fetch/fetch-my-profile";

interface EditProfileUploadActionData {
  pictureContentType: string;
  backgroundPictureContentType: string;
  uploadPicture: boolean;
  uploadBackgroundPicture: boolean;
}

interface EditProfileUploadActionResult {
  picture?: CreateFileUploadOutputModel;
  backgroundPicture?: CreateFileUploadOutputModel;
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
    if (e instanceof ProfileDoesNotExistError) {
      return ActionResponse.formGlobalError("profileDoesNotExist");
    } else {
      // TODO: log error report
      console.error(e);
      return ActionResponse.formGlobalError("general");
    }
  }
}
