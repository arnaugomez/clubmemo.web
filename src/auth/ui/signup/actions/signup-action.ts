"use server";
import { redirect } from "next/navigation";
import { UserAlreadyExistsError } from "@/src/auth/domain/errors/auth-errors";
import { locator_auth_SignupUseCase } from "@/src/auth/locators/locator_signup-use-case";
import { ActionErrorHandler } from "@/src/common/ui/actions/action-error-handler";
import { ActionResponse } from "@/src/common/ui/models/server-form-errors";
import type { SignupActionModel } from "../schemas/signup-action-schema";
import { SignupActionSchema } from "../schemas/signup-action-schema";

/**
 * Action to create a new user account with an email and password.
 * @param input The email and password of the new user
 */
export async function signupAction(input: SignupActionModel) {
  try {
    const parsed = SignupActionSchema.parse(input);

    const useCase = locator_auth_SignupUseCase();
    await useCase.execute(parsed);
  } catch (e) {
    if (e instanceof UserAlreadyExistsError) {
      return ActionResponse.formError("email", {
        type: "exists",
        message: "Ya existe un usuario con ese correo electrónico",
      });
    }
    return ActionErrorHandler.handle(e);
  }

  redirect(`/auth/verify-email`);
}
