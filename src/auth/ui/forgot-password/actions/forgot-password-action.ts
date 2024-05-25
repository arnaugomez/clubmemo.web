"use server";

import { locator } from "@/src/common/locator";
import { ActionErrorHandler } from "@/src/common/ui/actions/action-error-handler";
import { ActionResponse } from "@/src/common/ui/models/server-form-errors";
import type { ForgotPasswordActionModel } from "../schemas/forgot-password-action-schema";
import { ForgotPasswordActionSchema } from "../schemas/forgot-password-action-schema";

export async function forgotPasswordAction(input: ForgotPasswordActionModel) {
  try {
    const { email } = ForgotPasswordActionSchema.parse(input);
    const usersRepository = await locator.UsersRepository();
    const user = await usersRepository.getByEmail(email);
    if (!user) {
      return ActionResponse.formError("email", {
        message: "No existe un usuario con ese correo",
        type: "userDoesNotExist",
      });
    }

    const forgotPasswordTokensRepository =
      await locator.ForgotPasswordTokensRepository();
    const token = await forgotPasswordTokensRepository.generate(user.id);

    const emailService = await locator.EmailService();
    await emailService.sendForgotPasswordLink(user.email, token);
  } catch (e) {
    return ActionErrorHandler.handle(e);
  }
}
