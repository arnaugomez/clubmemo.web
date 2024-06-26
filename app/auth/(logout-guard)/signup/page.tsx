import { AuthPageTitle } from "@/src/auth/ui/components/auth-page-title";
import { SignupForm } from "@/src/auth/ui/signup/components/signup-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Crea tu usuario",
};

/**
 * Displays a form to create a new user account.
 */
export default function SignupPage() {
  return (
    <>
      <AuthPageTitle title="Crea tu usuario" testId="signup-title" />
      <div className="h-6"></div>
      <SignupForm />
    </>
  );
}
