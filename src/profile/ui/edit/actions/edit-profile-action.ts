"use server";
import { revalidatePath } from "next/cache";
import { ActionErrorHandler } from "@/src/common/ui/actions/action-error-handler";
import { ActionResponse } from "@/src/common/ui/models/server-form-errors";
import { HandleAlreadyExistsError } from "@/src/profile/domain/errors/profile-errors";
import { locator_profile_UpdateProfileUseCase } from "@/src/profile/locators/locator_update-profile-use-case";
import type { EditProfileActionModel } from "../schemas/edit-profile-action-schema";
import { EditProfileActionSchema } from "../schemas/edit-profile-action-schema";

/**
 * Changes the data of the profile of the currently logged in user.
 * @param input The data of the profile that will be updated
 */
export async function editProfileAction(input: EditProfileActionModel) {
  try {
    const parsed = EditProfileActionSchema.parse(input);

    const updateProfileUseCase = locator_profile_UpdateProfileUseCase();
    await updateProfileUseCase.execute(parsed);

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
