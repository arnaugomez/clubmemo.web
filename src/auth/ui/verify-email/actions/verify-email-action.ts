"use server";

import { authLocator } from "@/src/auth/auth-locator";
import { locator } from "@/src/common/locator";
import { ActionErrorHandler } from "@/src/common/ui/actions/action-error-handler";
import { ActionResponse } from "@/src/common/ui/models/server-form-errors";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { VerifyEmailActionModel } from "../schemas/verify-email-action-schema";
import { VerifyEmailActionSchema } from "../schemas/verify-email-action-schema";

export async function verifyEmailAction(input: VerifyEmailActionModel) {
  try {
    const { code } = VerifyEmailActionSchema.parse(input);
    const getSessionUseCase = authLocator.GetSessionUseCase();
    const { user } = await getSessionUseCase.execute();
    if (!user) {
      return ActionResponse.formGlobalError("sessionExpired");
    }

    const emailVerificationCodesRepository =
      await locator.EmailVerificationCodesRepository();
    const isValid = await emailVerificationCodesRepository.verify(
      user.id,
      code,
    );
    if (!isValid) {
      return ActionResponse.formError("code", {
        type: "invalidCode",
        message: "Invalid code",
      });
    }

    const sessionCookie = await locator.AuthService().verifyEmail(user.id);
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    );
  } catch (e) {
    return ActionErrorHandler.handle(e);
  }

  redirect(`/home`);
}
