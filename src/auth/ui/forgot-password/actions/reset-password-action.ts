"use server";

import { authLocator } from "@/src/auth/auth-locator";
import { ActionErrorHandler } from "@/src/common/ui/actions/action-error-handler";
import {
  ResetPasswordActionSchema,
  type ResetPasswordActionModel,
} from "../schemas/reset-password-action-schema";

export async function resetPasswordAction(input: ResetPasswordActionModel) {
  try {
    const parsed = ResetPasswordActionSchema.parse(input);

    const useCase = await authLocator.ResetPasswordUseCase();
    await useCase.execute(parsed);
  } catch (e) {
    return ActionErrorHandler.handle(e);
  }
}
