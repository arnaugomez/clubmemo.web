"use server";

import { locator } from "@/src/core/app/locator";
import { ActionResponse } from "@/src/ui/view-models/server-form-errors";
import { ObjectId } from "mongodb";

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
    const forgotPasswordCode = await forgotPasswordCodesRepository.get(
      user.id.toString()
    );
    if (!forgotPasswordCode || forgotPasswordCode.hasExpired) {
      return ActionResponse.formGlobalError("forgotPasswordCodeExpired");
    }

    const authService = locator.AuthService();
    await authService.updatePassword({
      userId: new ObjectId(user.id),
      password,
    });

    await forgotPasswordCodesRepository.delete(user.id.toString());

    await authService.invalidateUserSessions(new ObjectId(user.id));
  } catch (e) {
    console.error(e);
    return ActionResponse.formGlobalError("general");
  }
}
