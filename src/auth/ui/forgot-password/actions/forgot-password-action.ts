"use server";

import { UserDoesNotExistError } from "@/src/auth/domain/errors/auth-errors";
import { ActionErrorHandler } from "@/src/common/ui/actions/action-error-handler";
import { ActionResponse } from "@/src/common/ui/models/server-form-errors";
import type { ForgotPasswordActionModel } from "../schemas/forgot-password-action-schema";
import { ForgotPasswordActionSchema } from "../schemas/forgot-password-action-schema";
import { locator_auth_ForgotPasswordUseCase } from "@/src/auth/locators/locator_forgot-password-use-case";

/**
 * Sends an email to the user with a link to reset the password.
 * @param input Data with the email of the user
 */
export async function forgotPasswordAction(input: ForgotPasswordActionModel) {
  try {
    const { email } = ForgotPasswordActionSchema.parse(input);
    const useCase = locator_auth_ForgotPasswordUseCase();
    await useCase.execute(email);
  } catch (e) {
    if (e instanceof UserDoesNotExistError) {
      return ActionResponse.formError("email", {
        message: "No existe un usuario con ese correo",
        type: "userDoesNotExist",
      });
    }
    return ActionErrorHandler.handle(e);
  }
}
