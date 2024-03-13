"use server";

import { locator } from "@/src/core/app/locator";
import { ActionResponse } from "@/src/ui/view-models/server-form-errors";

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

    const forgotPasswordCodesRepository =
      await locator.ForgotPasswordCodesRepository();
    const code = await forgotPasswordCodesRepository.generate(user.id);

    const emailService = await locator.EmailService();
    await emailService.sendForgotPasswordCode(user.email, code.code);
  } catch (e) {
    console.error(e);
    return ActionResponse.formGlobalError("general");
  }
}
