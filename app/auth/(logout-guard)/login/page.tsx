import { AuthPageTitle } from "@/src/auth/ui/components/auth-page-title";
import { LoginForm } from "@/src/auth/ui/login/components/login-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login",
};

export default function LoginPage() {
  return (
    <>
      <AuthPageTitle
        title="¡Bienvenido!"
        description="Nos alegra tenerte por aquí."
      />
      <div className="h-6"></div>
      <LoginForm />
    </>
  );
}
