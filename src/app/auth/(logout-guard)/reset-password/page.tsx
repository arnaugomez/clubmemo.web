import { locator } from "@/src/core/app/locator";
import { ResetPasswordForm } from "@/src/ui/features/auth/forgot-password/components/reset-password-form";
import { textStyles } from "@/src/ui/styles/text-styles";
import { notFound } from "next/navigation";

interface SearchParams {
  email?: string;
  forgotPasswordCode?: string;
}

async function resetPasswordPageGuard(searchParams: SearchParams) {
  if (!searchParams.email || !searchParams.forgotPasswordCode) {
    notFound();
  }
  const usersRepository = await locator.UsersRepository();
  const user = await usersRepository.getByEmail(searchParams.email);
  if (!user) notFound();

  const forgotPasswordCodesRepository =
    await locator.ForgotPasswordCodesRepository();
  const forgotPasswordCode = await forgotPasswordCodesRepository.get(user.id);
  if (!forgotPasswordCode) notFound();

  if (forgotPasswordCode.hasExpired) notFound();

  if (forgotPasswordCode.code !== searchParams.forgotPasswordCode) notFound();
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
