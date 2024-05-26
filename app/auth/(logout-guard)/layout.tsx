import { fetchSession } from "@/src/auth/ui/fetch/fetch-session";
import { redirect } from "next/navigation";
import type { PropsWithChildren } from "react";

async function logoutGuard() {
  const result = await fetchSession();
  if (result.session) {
    if (result.user.isEmailVerified) {
      redirect("/home");
    }
    redirect("/auth/verify-email");
  }
}
export default async function LogoutGuardLayout({
  children,
}: PropsWithChildren) {
  await logoutGuard();
  return <>{children}</>;
}
