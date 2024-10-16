"use server";

import { InvalidTokenError } from "@/src/auth/domain/errors/auth-errors";
import { ActionErrorHandler } from "@/src/common/ui/actions/action-error-handler";
import { ActionResponse } from "@/src/common/ui/models/server-form-errors";
import { redirect } from "next/navigation";
import type { VerifyEmailActionModel } from "../schemas/verify-email-action-schema";
import { VerifyEmailActionSchema } from "../schemas/verify-email-action-schema";
import { locator_auth_VerifyEmailUseCase } from "@/src/auth/locators/locator_verify-email-use-case";

export async function verifyEmailAction(input: VerifyEmailActionModel) {
  try {
    const { code } = VerifyEmailActionSchema.parse(input);

    const useCase = locator_auth_VerifyEmailUseCase();
    await useCase.execute(code);
  } catch (e) {
    if (e instanceof InvalidTokenError) {
      return ActionResponse.formError("code", {
        type: "invalidCode",
        message: "Código incorrecto",
      });
    }
    return ActionErrorHandler.handle(e);
  }

  redirect(`/home`);
}
