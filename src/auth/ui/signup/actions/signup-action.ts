"use server";
import { authLocator } from "@/src/auth/auth-locator";
import { UserAlreadyExistsError } from "@/src/auth/domain/errors/auth-errors";
import { ActionErrorHandler } from "@/src/common/ui/actions/action-error-handler";
import { ActionResponse } from "@/src/common/ui/models/server-form-errors";
import { redirect } from "next/navigation";
import type { SignupActionModel } from "../schemas/signup-action-schema";
import { SignupActionSchema } from "../schemas/signup-action-schema";

export async function signupAction(input: SignupActionModel) {
  try {
    const parsed = SignupActionSchema.parse(input);

    const useCase = await authLocator.SignupUseCase();
    await useCase.execute(parsed);
  } catch (e) {
    if (e instanceof UserAlreadyExistsError) {
      return ActionResponse.formError("email", {
        type: "exists",
        message: "A user with this email already exists",
      });
    }
    return ActionErrorHandler.handle(e);
  }

  redirect(`/auth/verify-email`);
}
