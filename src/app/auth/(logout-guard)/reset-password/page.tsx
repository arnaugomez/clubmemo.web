import { locator } from "@/src/core/app/locator";
import { ResetPasswordForm } from "@/src/ui/features/auth/forgot-password/components/reset-password-form";
import { textStyles } from "@/src/ui/styles/text-styles";
import { notFound } from "next/navigation";

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

  const { email } = searchParams;
  if (!email) return notFound();

  return (
    <>
      <h1 className={textStyles.h2}>Nueva contraseña</h1>
      <div className="h-2"></div>
      <p>Entra una nueva contraseña para el usuario {email}</p>
      <div className="h-6"></div>
      <ResetPasswordForm email={email} />
    </>
  );
}
