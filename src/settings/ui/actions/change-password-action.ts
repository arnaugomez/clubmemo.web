"use server";
import { IncorrectPasswordError } from "@/src/auth/domain/errors/auth-errors";
import { waitMilliseconds } from "@/src/common/domain/utils/promise";
import { ActionErrorHandler } from "@/src/common/ui/actions/action-error-handler";
import { ActionResponse } from "@/src/common/ui/models/server-form-errors";
import type { ChangePasswordActionModel } from "../schemas/change-password-action-schema";
import { ChangePasswordActionSchema } from "../schemas/change-password-action-schema";
import { locator_auth_ChangePasswordUseCase } from "@/src/auth/locators/locator_change-password-use-case";

export async function changePasswordAction(input: ChangePasswordActionModel) {
  try {
    const parsed = ChangePasswordActionSchema.parse(input);

    const changePasswordUseCase = locator_auth_ChangePasswordUseCase();
    await changePasswordUseCase.execute({
      password: parsed.password,
      newPassword: parsed.newPassword,
    });
  } catch (e) {
    if (e instanceof IncorrectPasswordError) {
      await waitMilliseconds(800); // Prevent brute-force attacks
      return ActionResponse.formError("password", {
        message: "Contraseña incorrecta",
        type: "invalidCredentials",
      });
    }
    return ActionErrorHandler.handle(e);
  }
}
