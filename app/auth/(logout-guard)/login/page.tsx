import { LoginForm } from "@/src/auth/ui/login/components/login-form";
import { textStyles } from "@/src/common/ui/styles/text-styles";

export default function LoginPage() {
  return (
    <>
      <h1 className={textStyles.h2}>¡Bienvenido!</h1>
      <div className="h-2"></div>
      <p>Nos alegra tenerte por aquí.</p>
      <div className="h-6"></div>
      <LoginForm />
    </>
  );
}
