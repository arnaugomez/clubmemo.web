import { locator_auth_ForgotPasswordTokensRepository } from "@/src/auth/locators/locator_forgot-password-tokens-repository";
import { locator_auth_UsersRepository } from "@/src/auth/locators/locator_users-repository";
import { ResetPasswordPageLoaded } from "@/src/auth/ui/forgot-password/pages/reset-password-page-loaded";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

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
  if (!searchParams.email || !searchParams.token) {
    notFound();
  }
  const usersRepository = locator_auth_UsersRepository();
  const user = await usersRepository.getByEmail(searchParams.email);
  if (!user) notFound();

  const forgotPasswordTokensRepository =
    locator_auth_ForgotPasswordTokensRepository();
  const forgotPasswordCode = await forgotPasswordTokensRepository.get(user.id);
  if (!forgotPasswordCode) notFound();

  if (forgotPasswordCode.hasExpired) notFound();

  const isValid = await forgotPasswordTokensRepository.validate(
    user.id,
    searchParams.token,
  );

  if (!isValid) notFound();
}

/**
 * Shows a form to set a new password, thereby regaining access to the account.
 */
export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  await resetPasswordPageGuard(searchParams);

  const { email, token } = searchParams;
  if (!email || !token) return notFound();

  return <ResetPasswordPageLoaded email={email} token={token} />;
}
