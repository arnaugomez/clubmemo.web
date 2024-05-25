"use server";
import { ActionErrorHandler } from "@/src/common/ui/actions/action-error-handler";
import { ActionResponse } from "@/src/common/ui/models/server-form-errors";
import {
  HandleAlreadyExistsError,
  ProfileDoesNotExistError,
} from "@/src/profile/domain/errors/profile-errors";
import { profileLocator } from "@/src/profile/profile-locator";
import { revalidatePath } from "next/cache";
import { fetchMyProfile } from "../../fetch/fetch-my-profile";
import type { EditProfileActionModel } from "../schemas/edit-profile-action-schema";
import { EditProfileActionSchema } from "../schemas/edit-profile-action-schema";

export async function editProfileAction(input: EditProfileActionModel) {
  try {
    const parsed = EditProfileActionSchema.parse(input);
    const profile = await fetchMyProfile();
    if (!profile) throw new ProfileDoesNotExistError();

    const updateProfileUseCase = await profileLocator.UpdateProfileUseCase();
    await updateProfileUseCase.execute({ id: profile.id, ...parsed });

    revalidatePath("/");
  } catch (e) {
    if (e instanceof HandleAlreadyExistsError) {
      return ActionResponse.formError("handle", {
        message: "El identificador ya está en uso",
        type: "handleAlreadyExists",
      });
    }
    ActionErrorHandler.handle(e);
  }
}
