import { locator } from "@/src/core/app/locator";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/src/ui/components/shadcn/ui/alert";
import { checkSessionProvider } from "@/src/ui/features/auth/providers/check-session-provider";
import { VerifyEmailForm } from "@/src/ui/features/auth/verify-email/components/verify-email-form";
import { textStyles } from "@/src/ui/styles/text-styles";
import { Inbox, MailCheck } from "lucide-react";
import { redirect } from "next/navigation";

async function verifyEmailGuard() {
  const result = await checkSessionProvider();
  if (!result.session) {
    redirect("/auth/login");
  }
  if (result.user.isEmailVerified) {
    redirect("/home");
  }
}

async function handleVerificationCodeExpirationDate() {
  const { user } = await checkSessionProvider();
  if (user == null) throw new Error("User not found");

  const repository = await locator.EmailVerificationCodesRepository();
  const verificationCode = await repository.getByUserId(user.id.toString());
  if (!verificationCode || verificationCode.hasExpired) {
    const newVerificationCode = await repository.generate(user.id.toString());
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
  await verifyEmailGuard();

  const hasExpired = await handleVerificationCodeExpirationDate();

  const { user } = await checkSessionProvider();

  return (
    <>
      <MailCheck size={32} />
      <div className="h-6"></div>
      <h1 className={textStyles.h2}>¡Ya casi estamos!</h1>
      <div className="h-2"></div>
      <p>
        Te hemos enviado un correo electrónico a {user?.email} con un código de
        verificación.
      </p>
      {hasExpired && (
        <>
          <div className="h-6" />
          <Alert>
            <Inbox size={16} />
            <AlertTitle>Revisa de nuevo tu correo</AlertTitle>
            <AlertDescription>
              El código de verificación anterior ha expirado. Te hemos enviado
              uno nuevo.
            </AlertDescription>
          </Alert>
        </>
      )}
      <div className="h-8" />
      <VerifyEmailForm />
    </>
  );
}
