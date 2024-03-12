import { checkSession } from "@/src/check-session";
import { redirect } from "next/navigation";

async function loginGuard() {
  const result = await checkSession();
  if (!result.session) {
    redirect("/login");
  }
  if (!result.user.isEmailVerified) {
    redirect("/auth/verify-email");
  }
}
export default async function LoginGuardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await loginGuard();
  return <>{children}</>;
}
