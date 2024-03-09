import { ForgotPasswordForm } from "@/lib/ui/features/auth/forgot-password/components/forgot-password-form";
import { textStyles } from "@/lib/ui/styles/text-styles";

export default function ForgotPasswordPage() {
  return (
    <>
      <div className="w-full max-w-prose">
        <h1 className={textStyles.h2}>¿Olvidaste tu contraseña?</h1>
        <div className="h-2"></div>
        <p>Te enviamos un correo electrónico para recuperar tu cuenta.</p>
        <div className="h-6"></div>
        <ForgotPasswordForm />
      </div>
    </>
  );
}
