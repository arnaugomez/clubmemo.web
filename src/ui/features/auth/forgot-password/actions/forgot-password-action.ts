"use server";

import { locator } from "@/src/core/common/locator";
import { ActionResponse } from "@/src/ui/models/server-form-errors";

export async function forgotPasswordAction(email: string) {
  try {
    const usersRepository = await locator.UsersRepository();
    const user = await usersRepository.getByEmail(email);
    if (!user) {
      return ActionResponse.formError({
        name: "email",
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
    console.error(e);
    return ActionResponse.formGlobalError("general");
  }
}
