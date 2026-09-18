import * as Effect from "effect/Effect";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { EmailVerificationCodesRepository } from "@/src/auth/layers/layer_email-verification-codes-repository";
import { fetchSession } from "@/src/auth/ui/fetch/fetch-session";
import { VerifyEmailPageLoaded } from "@/src/auth/ui/verify-email/pages/verify-email-page-loaded";
import { NullError } from "@/src/common/domain/models/app-errors";
import { runServer } from "@/src/common/effect/server-runtime";
import { EmailService } from "@/src/common/layers/layer_email-service";

/**
 * Checks that the user is logged in and still has not verified the email. Otherwise,
 * it redirects to the login page or to the home page.
 */
async function verifyEmailGuard() {
  return runServer(
    Effect.gen(function* () {
      const result = yield* Effect.tryPromise({
        try: () => fetchSession(),
        catch: (error) => error,
      });
      if (!result.session) {
        redirect("/auth/login");
      }
      if (result.user.isEmailVerified) {
        redirect("/home");
      }
      return result;
    }),
  );
}

export const metadata: Metadata = {
  title: "Verifica tu email",
};

/**
 * Checks if the email verification code has expired and sends a new one if it has.
 */
async function handleVerificationCodeExpirationDate() {
  return runServer(
    Effect.gen(function* () {
      const { user } = yield* Effect.tryPromise({
        try: () => fetchSession(),
        catch: (error) => error,
      });
      if (!user) return yield* Effect.fail(new NullError("user"));

      const repository = yield* EmailVerificationCodesRepository;
      const verificationCode = yield* repository.getByUserId(user.id);
      if (!verificationCode || verificationCode.hasExpired) {
        const newVerificationCode = yield* repository.generate(user.id);
        const emailService = yield* EmailService;
        yield* emailService.sendVerificationCode(
          user.email,
          newVerificationCode.code,
        );
        return true;
      }
      return false;
    }),
  );
}

/**
 * Shows a form with an OTP input that, when submitted successfully, verifies the email
 * of the user and grants access to the rest of the application.
 */
export default async function VerifyEmailPage() {
  return runServer(
    Effect.gen(function* () {
      const { user } = yield* Effect.tryPromise({
        try: () => verifyEmailGuard(),
        catch: (error) => error,
      });

      const hasExpired = yield* Effect.tryPromise({
        try: () => handleVerificationCodeExpirationDate(),
        catch: (error) => error,
      });

      return <VerifyEmailPageLoaded user={user} hasExpired={hasExpired} />;
    }),
  );
}
