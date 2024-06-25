import { fetchSession } from "@/src/auth/ui/fetch/fetch-session";
import { VerifyEmailPageLoaded } from "@/src/auth/ui/verify-email/pages/verify-email-page-loaded";
import { locator } from "@/src/common/di/locator";
import { NullError } from "@/src/common/domain/models/app-errors";
import type { Metadata } from "next";

import { redirect } from "next/navigation";

/**
 * Checks that the user is logged in and still has not verified the email. Otherwise,
 * it redirects to the login page or to the home page.
 */
async function verifyEmailGuard() {
  const result = await fetchSession();
  if (!result.session) {
    redirect("/auth/login");
  }
  if (result.user.isEmailVerified) {
    redirect("/home");
  }
  return result;
}

export const metadata: Metadata = {
  title: "Verifica tu email",
};

/**
 * Checks if the email verification code has expired and sends a new one if it has.
 */
async function handleVerificationCodeExpirationDate() {
  const { user } = await fetchSession();
  if (!user) throw new NullError("user");

  const repository = await locator.EmailVerificationCodesRepository();
  const verificationCode = await repository.getByUserId(user.id);
  if (!verificationCode || verificationCode.hasExpired) {
    const newVerificationCode = await repository.generate(user.id);
    const emailService = await locator.EmailService();
    await emailService.sendVerificationCode(
      user.email,
      newVerificationCode.code,
    );
    return true;
  }
  return false;
}

/**
 * Shows a form with an OTP input that, when submitted successfully, verifies the email
 * of the user and grants access to the rest of the application.
 */
export default async function VerifyEmailPage() {
  const { user } = await verifyEmailGuard();

  const hasExpired = await handleVerificationCodeExpirationDate();

  return <VerifyEmailPageLoaded user={user} hasExpired={hasExpired} />;
}
