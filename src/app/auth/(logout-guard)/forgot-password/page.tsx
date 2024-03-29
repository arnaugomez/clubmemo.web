import { ForgotPasswordForm } from "@/src/ui/features/auth/forgot-password/components/forgot-password-form";
import { textStyles } from "@/src/ui/styles/text-styles";

export default function ForgotPasswordPage() {
  return (
    <>
      <h1 className={textStyles.h2}>¿Olvidaste tu contraseña?</h1>
      <div className="h-2"></div>
      <p>Te enviamos un correo electrónico para recuperar tu cuenta.</p>
      <div className="h-6"></div>
      <ForgotPasswordForm />
    </>
  );
}
