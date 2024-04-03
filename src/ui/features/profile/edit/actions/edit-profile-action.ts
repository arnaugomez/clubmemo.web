"use server";
import {
  HandleAlreadyExistsError,
  ProfileDoesNotExistError,
} from "@/src/core/profile/domain/errors/profile-errors";
import { profileLocator } from "@/src/core/profile/profile-locator";
import { ActionResponse } from "@/src/ui/view-models/server-form-errors";
import { revalidatePath } from "next/cache";
import { fetchMyProfile } from "../../fetch/fetch-my-profile";

interface EditProfileActionModel {
  displayName: string;
  handle: string;
  bio: string;
  website: string;
  isPublic: boolean;
  tags: string[];
}

export async function editProfileAction(data: EditProfileActionModel) {
  try {
    const profile = await fetchMyProfile();
    if (!profile) throw new ProfileDoesNotExistError();

    const updateProfileUseCase = await profileLocator.UpdateProfileUseCase();
    await updateProfileUseCase.execute({ id: profile.id, ...data });

    revalidatePath("/");
  } catch (e) {
    if (e instanceof ProfileDoesNotExistError) {
      return ActionResponse.formGlobalError("profileDoesNotExist");
    } else if (e instanceof HandleAlreadyExistsError) {
      return ActionResponse.formError({
        name: "handle",
        message: "El identificador ya está en uso",
        type: "handleAlreadyExists",
      });
    } else {
      // TODO: log error report
      console.error(e);
      return ActionResponse.formGlobalError("general");
    }
  }
}
