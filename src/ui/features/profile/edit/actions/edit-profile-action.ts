"use server";
import { locator } from "@/src/core/app/locator";
import {
  HandleAlreadyExistsError,
  ProfileDoesNotExistError,
} from "@/src/core/profile/domain/errors/profile-errors";
import { ActionResponse } from "@/src/ui/view-models/server-form-errors";
import { revalidatePath } from "next/cache";
import { fetchMyProfile } from "../../fetch/fetch-my-profile";

interface EditProfileActionModel {
  displayName: string;
  handle: string;
  bio: string;
  website: string;
  isPublic: boolean;
}

export async function editProfileAction(data: EditProfileActionModel) {
  try {
    const profile = await fetchMyProfile();
    if (!profile) throw new ProfileDoesNotExistError();

    const profilesRepository = await locator.ProfilesRepository();
    await profilesRepository.update({ id: profile.id, ...data });

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
