"use server";

import { fetchSession } from "@/src/auth/ui/fetch/fetch-session";
import { locator } from "@/src/common/locator";
import { ActionResponse } from "@/src/common/ui/models/server-form-errors";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

interface VerifyEmailActionViewModel {
  code: string;
}

export async function verifyEmailAction({ code }: VerifyEmailActionViewModel) {
  const { user } = await fetchSession();
  if (!user) {
    return ActionResponse.formGlobalError("sessionExpired");
  }

  const emailVerificationCodesRepository =
    await locator.EmailVerificationCodesRepository();
  const isValid = await emailVerificationCodesRepository.verify(user.id, code);
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

  redirect(`/home`);
}
