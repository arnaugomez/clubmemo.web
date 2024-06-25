import { AuthPageTitle } from "@/src/auth/ui/components/auth-page-title";
import { ForgotPasswordForm } from "@/src/auth/ui/forgot-password/components/forgot-password-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Recupera tu cuenta",
};

/**
 * This page is visited when the user has forgotten its credentials and wants to
 * recover their account. It shows a form that, when submitted, sends a password
 * restoration email to the user.
 */
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
