import { redirect } from "next/navigation";
import { fetchSession } from "../fetch/fetch-session";

/**
 * Checks that the user has verified the email.
 *
 * If the email is not verified yet, redirects to the email verification page.
 */
export async function verifyEmailGuard() {
  const { user } = await fetchSession();
  if (user && !user.isEmailVerified) {
    redirect("/auth/verify-email");
  }
}
