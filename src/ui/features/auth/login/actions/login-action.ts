"use server";
import { waitMilliseconds } from "@/src/common/utils/promises";
import { lucia, usersCollection } from "@/src/lucia";
import { ActionResponse } from "@/src/ui/view-models/server-form-errors";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Argon2id } from "oslo/password";

interface LoginViewModel {
  email: string;
  password: string;
}

export async function loginAction(data: LoginViewModel) {
  // TODO: validate email and password on the server side too?
  const { email, password } = data;
  const existingUser = await usersCollection.findOne({ email });

  if (!existingUser) {
    await waitMilliseconds(800); // Prevent brute-force attacks
    return ActionResponse.formGlobalError("invalidCredentials");
  }

  const passwordIsValid = await new Argon2id().verify(
    existingUser.hashed_password,
    password,
  );
  if (!passwordIsValid) {
    await waitMilliseconds(800); // Prevent brute-force attacks
    return ActionResponse.formGlobalError("invalidCredentials");
  }

  const session = await lucia.createSession(existingUser._id, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );

  // TODO: send email verification
  redirect(`/home`);
}
