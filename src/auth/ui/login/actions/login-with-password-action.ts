"use server";
import {
  IncorrectPasswordError,
  UserDoesNotExistError,
} from "@/src/auth/domain/errors/auth-errors";
import { waitMilliseconds } from "@/src/common/domain/utils/promise";
import { ActionErrorHandler } from "@/src/common/ui/actions/action-error-handler";
import { ActionResponse } from "@/src/common/ui/models/server-form-errors";
import { redirect } from "next/navigation";
import {
  LoginWithPasswordActionSchema,
  type LoginWithPasswordActionModel,
} from "../schemas/login-with-password-action-schema";
import { locator_auth_LoginWithPasswordUseCase } from "@/src/auth/locators/locator_login-with-password-use-case";

/**
 * Checks that the user credentials (email and password) are valid and creates a
 * new session to log in the user. Then, it redirects to the home page.
 *
 * @param input The credentials of the user: email and password
 */
export async function loginWithPasswordAction(
  input: LoginWithPasswordActionModel,
) {
  try {
    const parsed = LoginWithPasswordActionSchema.parse(input);

    const useCase = locator_auth_LoginWithPasswordUseCase();
    await useCase.execute(parsed);
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
