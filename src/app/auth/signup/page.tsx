import { RegisterForm } from "@/src/ui/features/auth/signup/components/signup-form";
import { textStyles } from "@/src/ui/styles/text-styles";

export default function RegisterPage() {
  return (
    <>
      <div className="w-full max-w-prose">
        <h1 className={textStyles.h2}>Crea tu usuario</h1>
        <div className="h-6"></div>
        <RegisterForm />
      </div>
    </>
  );
}
