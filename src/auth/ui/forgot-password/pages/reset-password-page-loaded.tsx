import { textStyles } from "@/src/common/ui/styles/text-styles";
import { ResetPasswordForm } from "../components/reset-password-form";

interface ResetPasswordPageLoadedProps {
  email: string;
  token: string;
}

/**
 * Content of reset password page. Contains a form to set a new password.
 */
export function ResetPasswordPageLoaded({
  email,
  token,
}: ResetPasswordPageLoadedProps) {
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
