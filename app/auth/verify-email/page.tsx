import { fetchSession } from "@/src/auth/ui/fetch/fetch-session";
import { VerifyEmailPageLoaded } from "@/src/auth/ui/verify-email/pages/verify-email-page-loaded";
import { NullError } from "@/src/common/domain/models/app-errors";
import { locator } from "@/src/common/locator";

import { redirect } from "next/navigation";

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

export default async function VerifyEmailPage() {
  const { user } = await verifyEmailGuard();

  const hasExpired = await handleVerificationCodeExpirationDate();

  return <VerifyEmailPageLoaded user={user} hasExpired={hasExpired} />;
}
