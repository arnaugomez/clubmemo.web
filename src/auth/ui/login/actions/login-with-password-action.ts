"use server";
import { authLocator } from "@/src/auth/auth-locator";
import {
  IncorrectPasswordError,
  UserDoesNotExistError,
} from "@/src/auth/domain/errors/auth-errors";
import { waitMilliseconds } from "@/src/common/domain/utils/promises";
import { ActionErrorHandler } from "@/src/common/ui/actions/action-error-handler";
import { ActionResponse } from "@/src/common/ui/models/server-form-errors";
import { redirect } from "next/navigation";
import type { LoginWithPasswordActionModel } from "../schemas/login-with-password-action-schema";

export async function loginWithPasswordAction(
  input: LoginWithPasswordActionModel,
) {
  try {
    const useCase = await authLocator.LoginWithPasswordUseCase();
    await useCase.execute(input);
  } catch (e) {
    if (
      e instanceof UserDoesNotExistError ||
      e instanceof IncorrectPasswordError
    ) {
      await waitMilliseconds(800); // Prevent brute-force attacks
      return ActionResponse.formError("password", {
        message: "Credenciales inválidas",
        type: "invalidCredentials",
      });
    }
    return ActionErrorHandler.handle(e);
  }
  redirect(`/home`);
}
