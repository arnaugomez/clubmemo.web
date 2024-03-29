"use server";

import { locator } from "@/src/core/app/locator";
import { checkSessionProvider } from "@/src/ui/features/auth/providers/check-session-provider";
import { ActionResponse } from "@/src/ui/view-models/server-form-errors";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

interface VerifyEmailActionViewModel {
  code: string;
}

export async function verifyEmailAction({ code }: VerifyEmailActionViewModel) {
  const { user } = await checkSessionProvider();
  if (!user) {
    return ActionResponse.formGlobalError("sessionExpired");
  }

  const emailVerificationCodesRepository =
    await locator.EmailVerificationCodesRepository();
  const isValid = await emailVerificationCodesRepository.verify(
    user.id.toString(),
    code,
  );
  if (!isValid) {
    return ActionResponse.formError({
      name: "code",
      type: "invalidCode",
      message: "Invalid code",
    });
  }

  const sessionCookie = await locator
    .AuthService()
    .verifyEmail(user.id.toString());
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );

  redirect(`/home`);
}
