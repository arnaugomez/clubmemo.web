"use server";
import { lucia, usersCollection } from "@/src/lucia";
import { ActionResponse } from "@/src/ui/view-models/server-form-errors";
import { generateId } from "lucia";
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
  const userId = generateId(15);
  // TODO Check if user with that email already exists
  const existingUser = await usersCollection.findOne({ email: data.email });
  if (existingUser) {
    return ActionResponse.formError({
      name: "email",
      type: "exists",
      message: "A user with this email already exists",
    });
  }
  await usersCollection.insertOne({
    _id: userId, // TODO: do we need to use the Lucia `generateId` function here? Or can we let MongoDB handle it?
    email: data.email,
    hashed_password: hashedPassword,
  });

  const session = await lucia.createSession(userId, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );

  // TODO: send email verification
  redirect(`/auth/verify-email`);
}
