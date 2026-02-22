"use server";

import { locator_auth_ResetPasswordUseCase } from "@/src/auth/locators/locator_reset-password-use-case";
import { ActionErrorHandler } from "@/src/common/ui/actions/action-error-handler";
import {
  type ResetPasswordActionModel,
  ResetPasswordActionSchema,
} from "../schemas/reset-password-action-schema";

/**
 * Changes the password of a user. Used when the user forgot the password and
 * was sent a password reset code.
 *
 * @param input The data of the user and the new password
 */
export async function resetPasswordAction(input: ResetPasswordActionModel) {
  try {
    const parsed = ResetPasswordActionSchema.parse(input);

    const useCase = locator_auth_ResetPasswordUseCase();
    await useCase.execute(parsed);
  } catch (e) {
    return ActionErrorHandler.handle(e);
  }
}
