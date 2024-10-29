import type { UserModel } from "@/src/auth/domain/models/user-model";

import { MailCheck } from "lucide-react";
import { AuthPageTitle } from "../../components/auth-page-title";
import { VerifyEmailExpiredAlert } from "../components/verify-email-expired-alert";
import { VerifyEmailForm } from "../components/verify-email-form";

interface VerifyEmailPageLoadedProps {
  hasExpired: boolean;
  user: UserModel;
}

/**
 * Content of the page that asks the user to verify their email.
 */
export function VerifyEmailPageLoaded({
  user,
  hasExpired,
}: VerifyEmailPageLoadedProps) {
  return (
    <>
      <MailCheck size={32} />
      <div className="h-6"></div>
      <AuthPageTitle
        title="¡Ya casi estamos!"
        testId="verify-email-title"
        description={`Te hemos enviado un correo electrónico a ${user.email} con un código de verificación.`}
      />
      {hasExpired && (
        <>
          <div className="h-6" />
          <VerifyEmailExpiredAlert />
        </>
      )}
      <div className="h-8" />
      <VerifyEmailForm />
    </>
  );
}
