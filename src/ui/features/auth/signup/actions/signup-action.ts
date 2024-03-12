"use server";
import { EmailServiceImpl } from "@/src/core/app/data/services/email-service-impl";
import { lucia, usersCollection } from "@/src/lucia";
import { ActionResponse } from "@/src/ui/view-models/server-form-errors";
import { generateEmailVerificationCode } from "@/src/verification-codes";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Argon2id } from "oslo/password";

interface SignupViewModel {
  email: string;
  password: string;
}

export async function signupAction(data: SignupViewModel) {
  const { email, password } = data;
  // TODO: validate email and password on the server side too?
  const hashedPassword = await new Argon2id().hash(password);
  const existingUser = await usersCollection.findOne({ email });
  if (existingUser) {
    return ActionResponse.formError({
      name: "email",
      type: "exists",
      message: "A user with this email already exists",
    });
  }
  const result = await usersCollection.insertOne({
    email,
    hashed_password: hashedPassword,
    authTypes: ["email"],
  });
  const userId = result.insertedId;
  const verificationCode = await generateEmailVerificationCode(userId);
  await sendEmailVerificationCode(email, verificationCode);

  const session = await lucia.createSession(result.insertedId, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );

  redirect(`/auth/verify-email`);
}

async function sendEmailVerificationCode(
  email: string,
  verificationCode: string,
) {
  new EmailServiceImpl().sendVerificationCode(email, verificationCode);
  // TODO: send email
  console.log(
    `Sending email verification code to ${email}: ${verificationCode}`,
  );
}
