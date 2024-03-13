"use server";

import { checkSession } from "@/src/check-session";
import { locator } from "@/src/core/app/locator";
import { lucia, usersCollection } from "@/src/lucia";
import { ActionResponse } from "@/src/ui/view-models/server-form-errors";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

interface VerifyEmailActionViewModel {
  code: string;
}

export async function verifyEmailAction({ code }: VerifyEmailActionViewModel) {
  const { user } = await checkSession();
  if (!user) {
    return ActionResponse.formGlobalError("sessionExpired");
  }

  const emailVerificationCodesRepository =
    await locator.EmailVerificationCodesRepository();
  const isValid = await emailVerificationCodesRepository.verify(user.id, code);
  if (!isValid) {
    return ActionResponse.formError({
      name: "code",
      type: "invalidCode",
      message: "Invalid code",
    });
  }

  await usersCollection.findOneAndUpdate(
    { _id: user.id },
    { $set: { isEmailVerified: true } },
  );

  await lucia.invalidateUserSessions(user.id);
  const session = await lucia.createSession(user.id, {});

  const sessionCookie = lucia.createSessionCookie(session.id);
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );

  redirect(`/home`);
}
