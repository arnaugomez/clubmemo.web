"use server";

import { locator } from "@/src/core/common/locator";
import { ActionResponse } from "@/src/ui/models/server-form-errors";

interface ResetPasswordActionViewModel {
  email: string;
  password: string;
}

export async function resetPasswordAction({
  email,
  password,
}: ResetPasswordActionViewModel) {
  try {
    const usersRepository = await locator.UsersRepository();

    const user = await usersRepository.getByEmail(email);
    if (!user) {
      return ActionResponse.formGlobalError("userDoesNotExist");
    }

    const forgotPasswordCodesRepository =
      await locator.ForgotPasswordTokensRepository();
    const forgotPasswordCode = await forgotPasswordCodesRepository.get(user.id);
    if (!forgotPasswordCode || forgotPasswordCode.hasExpired) {
      return ActionResponse.formGlobalError("forgotPasswordCodeExpired");
    }

    const authService = locator.AuthService();
    await authService.updatePassword({
      userId: user.id,
      password,
    });

    await forgotPasswordCodesRepository.delete(user.id);

    await authService.invalidateUserSessions(user.id);
  } catch (e) {
    console.error(e);
    return ActionResponse.formGlobalError("general");
  }
}
