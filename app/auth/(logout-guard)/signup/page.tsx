import { AuthPageTitle } from "@/src/auth/ui/components/auth-page-title";
import { SignupForm } from "@/src/auth/ui/signup/components/signup-form";

export default function SignupPage() {
  return (
    <>
      <AuthPageTitle title="Crea tu usuario" />
      <div className="h-6"></div>
      <SignupForm />
    </>
  );
}
