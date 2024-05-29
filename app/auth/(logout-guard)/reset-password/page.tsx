import { ResetPasswordPageLoaded } from "@/src/auth/ui/forgot-password/pages/reset-password-page-loaded";
import { locator } from "@/src/common/di/locator";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nueva contraseña",
};

interface SearchParams {
  email?: string;
  token?: string;
}

async function resetPasswordPageGuard(searchParams: SearchParams) {
  if (!searchParams.email || !searchParams.token) {
    notFound();
  }
  const usersRepository = await locator.UsersRepository();
  const user = await usersRepository.getByEmail(searchParams.email);
  if (!user) notFound();

  const forgotPasswordTokensRepository =
    await locator.ForgotPasswordTokensRepository();
  const forgotPasswordCode = await forgotPasswordTokensRepository.get(user.id);
  if (!forgotPasswordCode) notFound();

  if (forgotPasswordCode.hasExpired) notFound();

  const isValid = await forgotPasswordTokensRepository.validate(
    user.id,
    searchParams.token,
  );

  if (!isValid) notFound();
}

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
