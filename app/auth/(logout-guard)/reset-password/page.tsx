import * as Effect from "effect/Effect";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ForgotPasswordTokensRepository } from "@/src/auth/layers/layer_forgot-password-tokens-repository";
import { UsersRepository } from "@/src/auth/layers/layer_users-repository";
import { ResetPasswordPageLoaded } from "@/src/auth/ui/forgot-password/pages/reset-password-page-loaded";
import { runServer } from "@/src/common/effect/server-runtime";

export const metadata: Metadata = {
  title: "Nueva contraseña",
};

interface SearchParams {
  email?: string;
  token?: string;
}

/**
 * Verifies that the user can access the reset password check. It does so by checking
 * the validity of the password recovery code and the email.
 */
async function resetPasswordPageGuard(searchParams: SearchParams) {
  return runServer(
    Effect.gen(function* () {
      if (!searchParams.email || !searchParams.token) {
        notFound();
      }
      const usersRepository = yield* UsersRepository;
      const user = yield* usersRepository.getByEmail(searchParams.email);
      if (!user) notFound();

      const forgotPasswordTokensRepository =
        yield* ForgotPasswordTokensRepository;
      const forgotPasswordCode = yield* forgotPasswordTokensRepository.get(
        user.id,
      );
      if (!forgotPasswordCode) notFound();

      if (forgotPasswordCode.hasExpired) notFound();

      const isValid = yield* forgotPasswordTokensRepository.validate(
        user.id,
        searchParams.token,
      );

      if (!isValid) notFound();
    }),
  );
}

/**
 * Shows a form to set a new password, thereby regaining access to the account.
 */
export default async function ResetPasswordPage(props: {
  searchParams: Promise<SearchParams>;
}) {
  return runServer(
    Effect.gen(function* () {
      const searchParams = yield* Effect.tryPromise({
        try: () => props.searchParams,
        catch: (error) => error,
      });
      yield* Effect.tryPromise({
        try: () => resetPasswordPageGuard(searchParams),
        catch: (error) => error,
      });

      const { email, token } = searchParams;
      if (!email || !token) return notFound();

      return <ResetPasswordPageLoaded email={email} token={token} />;
    }),
  );
}
