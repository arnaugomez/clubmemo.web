"use server";

import { authLocator } from "@/src/auth/auth-locator";
import { ActionErrorHandler } from "@/src/common/ui/actions/action-error-handler";
import {
  ResetPasswordActionSchema,
  type ResetPasswordActionModel,
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

    const useCase = await authLocator.ResetPasswordUseCase();
    await useCase.execute(parsed);
  } catch (e) {
    return ActionErrorHandler.handle(e);
  }
}
