import { SignupForm } from "@/src/auth/ui/signup/components/signup-form";
import { textStyles } from "@/src/common/ui/styles/text-styles";

export default function RegisterPage() {
  return (
    <>
      <h1 className={textStyles.h2}>Crea tu usuario</h1>
      <div className="h-6"></div>
      <SignupForm />
    </>
  );
}
