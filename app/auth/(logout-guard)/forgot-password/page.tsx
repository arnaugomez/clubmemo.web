import { AuthPageTitle } from "@/src/auth/ui/components/auth-page-title";
import { ForgotPasswordForm } from "@/src/auth/ui/forgot-password/components/forgot-password-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Recupera tu cuenta",
};

export default function ForgotPasswordPage() {
  return (
    <>
      <AuthPageTitle
        title="¿Olvidaste tu contraseña?"
        description="Te enviamos un correo electrónico para recuperar tu cuenta."
      />
      <div className="h-6"></div>
      <ForgotPasswordForm />
    </>
  );
}
