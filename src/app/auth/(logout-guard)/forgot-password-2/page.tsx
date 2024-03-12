import { ForgotPassword2Form } from "@/src/ui/features/auth/forgot-password/components/forgot-password-2-form";
import { textStyles } from "@/src/ui/styles/text-styles";

export default function ForgotPassword2Page() {
  return (
    <>
      <div className="w-full max-w-prose">
        <h1 className={textStyles.h2}>Nueva contraseña</h1>
        <div className="h-2"></div>
        <p>Entra una nueva contraseña para el usuario todo@gmail.com</p>
        <div className="h-6"></div>
        <ForgotPassword2Form />
      </div>
    </>
  );
}
