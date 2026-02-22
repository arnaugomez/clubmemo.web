import { redirect } from "next/navigation";
import type { PropsWithChildren } from "react";
import { fetchSession } from "@/src/auth/ui/fetch/fetch-session";

/**
 * Checks that the user is logged in and has verified the email. Otherwise, it
 * redirects to the landing page or to the email verification page.
 */
async function loginGuard() {
  const result = await fetchSession();
  if (!result.session) {
    redirect("/");
  }
  if (!result.user.isEmailVerified) {
    redirect("/auth/verify-email");
  }
}

/**
 * Applies the `loginGuard` guard to the pages inside this layout
 */
export default async function LoginGuardLayout({
  children,
}: PropsWithChildren) {
  await loginGuard();
  return <>{children}</>;
}
