"use server";

import { UserDoesNotExistError } from "@/src/auth/domain/errors/auth-errors";
import { NoPermissionError } from "@/src/common/domain/models/app-errors";
import { locator } from "@/src/common/locator";
import { ActionErrorHandler } from "@/src/common/ui/actions/action-error-handler";
import { ActionResponse } from "@/src/common/ui/models/server-form-errors";
import {
  ResetPasswordActionSchema,
  type ResetPasswordActionModel,
} from "../schemas/reset-password-action-schema";

export async function resetPasswordAction(input: ResetPasswordActionModel) {
  try {
    const parsed = ResetPasswordActionSchema.parse(input);
    const usersRepository = await locator.UsersRepository();

    const user = await usersRepository.getByEmail(parsed.email);
    if (!user) {
      throw new UserDoesNotExistError();
    }

    const forgotPasswordCodesRepository =
      await locator.ForgotPasswordTokensRepository();

    const isValid = await forgotPasswordCodesRepository.validate(
      user.id,
      parsed.token,
    );
    if (!isValid) {
      throw new NoPermissionError();
    }

    const forgotPasswordCode = await forgotPasswordCodesRepository.get(user.id);
    if (!forgotPasswordCode || forgotPasswordCode.hasExpired) {
      return ActionResponse.formGlobalError("forgotPasswordCodeExpired");
    }

    const authService = locator.AuthService();
    await authService.updatePassword({
      userId: user.id,
      password: parsed.password,
    });

    await forgotPasswordCodesRepository.delete(user.id);

    await authService.invalidateUserSessions(user.id);
  } catch (e) {
    return ActionErrorHandler.handle(e);
  }
}
