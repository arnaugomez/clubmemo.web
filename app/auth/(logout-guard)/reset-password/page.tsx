import { ResetPasswordForm } from "@/src/auth/ui/forgot-password/components/reset-password-form";
import { locator } from "@/src/common/locator";
import { textStyles } from "@/src/common/ui/styles/text-styles";
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

  const { email, token } = searchParams;
  if (!email || !token) return notFound();

  return (
    <>
      <h1 className={textStyles.h2}>Nueva contraseña</h1>
      <div className="h-2"></div>
      <p>Entra una nueva contraseña para el usuario {email}</p>
      <div className="h-6"></div>
      <ResetPasswordForm email={email} token={token} />
    </>
  );
}
