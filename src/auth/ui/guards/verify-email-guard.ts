import { redirect } from "next/navigation";
import { fetchSession } from "../fetch/fetch-session";

export async function verifyEmailGuard() {
  const {user} = await fetchSession();
  if (user && !user.isEmailVerified) {
    redirect("/auth/verify-email");
  }
}