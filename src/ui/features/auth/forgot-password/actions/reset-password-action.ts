"use server";

import { locator } from "@/src/core/app/locator";
import { ActionResponse } from "@/src/ui/view-models/server-form-errors";

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

    await usersRepository.updatePassword({
      userId: user.id,
      password,
    });

    const authService = locator.AuthService();
    await authService.invalidateUserSessions(user.id);
  } catch (e) {
    console.error(e);
    return ActionResponse.formGlobalError("general");
  }
}
