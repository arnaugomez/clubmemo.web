"use server";
import { locator } from "@/src/core/app/locator";
import { UserDoesNotExistError } from "@/src/core/auth/domain/errors/auth-errors";
import {
  HandleAlreadyExistsError,
  ProfileDoesNotExistError,
} from "@/src/core/profile/domain/errors/profile-errors";
import { ActionResponse } from "@/src/ui/view-models/server-form-errors";
import { fetchSession } from "../../../auth/fetch/fetch-session";

interface EditProfileActionModel {
  displayName: string;
  handle: string;
  bio: string;
  website: string;
  isPublic: boolean;
}

export async function editProfileAction(data: EditProfileActionModel) {
  try {
    const { user } = await fetchSession();
    if (!user) throw new UserDoesNotExistError();

    const profilesRepository = await locator.ProfilesRepository();
    const profile = await profilesRepository.getByUserId(user.id);
    if (!profile) throw new ProfileDoesNotExistError();

    await profilesRepository.update({ id: profile.id, ...data });
    // TODO: refresh profile data in the UI
  } catch (e) {
    if (e instanceof UserDoesNotExistError) {
      return ActionResponse.formGlobalError("userDoesNotExist");
    } else if (e instanceof UserDoesNotExistError) {
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
