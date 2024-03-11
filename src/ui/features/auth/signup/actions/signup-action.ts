"use server";
import { lucia, usersCollection } from "@/src/lucia";
import { ActionResponse } from "@/src/ui/view-models/server-form-errors";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Argon2id } from "oslo/password";

interface SignupViewModel {
  email: string;
  password: string;
}

export async function signupAction(data: SignupViewModel) {
  // TODO: validate email and password on the server side too?
  const hashedPassword = await new Argon2id().hash(data.password);
  // TODO Check if user with that email already exists
  const existingUser = await usersCollection.findOne({ email: data.email });
  if (existingUser) {
    return ActionResponse.formError({
      name: "email",
      type: "exists",
      message: "A user with this email already exists",
    });
  }
  const result = await usersCollection.insertOne({
    email: data.email,
    hashed_password: hashedPassword,
    authTypes: ["email"],
  });

  const session = await lucia.createSession(result.insertedId, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );

  // TODO: send email verification
  redirect(`/auth/verify-email`);
}
