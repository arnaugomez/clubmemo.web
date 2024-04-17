"use server";

import { locator } from "@/src/core/common/locator";
import { ProfileDoesNotExistError } from "@/src/core/profile/domain/errors/profile-errors";
import { ActionResponse } from "@/src/ui/models/server-form-errors";
import { fetchMyProfile } from "../../fetch/fetch-my-profile";

interface EditProfileUploadActionData {
  contentType: string;
}

export async function editProfileUploadAction({
  contentType,
}: EditProfileUploadActionData) {
  try {
    const profile = await fetchMyProfile();
    if (!profile) throw new ProfileDoesNotExistError();
    const uploadFileService = await locator.UploadFileService();

    const result = await uploadFileService.generatePresignedUrl({
      key: `profile/${profile.id}`,
      contentType,
    });
    return ActionResponse.formSuccess(result.data);
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
