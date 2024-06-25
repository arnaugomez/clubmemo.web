import { fetchSession } from "@/src/auth/ui/fetch/fetch-session";
import { redirect } from "next/navigation";
import type { PropsWithChildren } from "react";

/**
 * Checks that the user is logged out. Otherwise, it redirects to the home page
 * (if the email is verified) or to the email verification page.
 */
async function logoutGuard() {
  const result = await fetchSession();
  if (result.session) {
    if (result.user.isEmailVerified) {
      redirect("/home");
    }
    redirect("/auth/verify-email");
  }
}

/**
 * Applies the `logoutGuard` guard to all the pages inside this layout.
 */
export default async function LogoutGuardLayout({
  children,
}: PropsWithChildren) {
  await logoutGuard();
  return <>{children}</>;
}
