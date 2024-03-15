import { checkSessionProvider } from "@/src/ui/features/auth/providers/check-session-provider";
import { redirect } from "next/navigation";

async function logoutGuard() {
  const result = await checkSessionProvider();
  if (result.session) {
    if (result.user.isEmailVerified) {
      redirect("/home");
    }
    redirect("/auth/verify-email");
  }
}
export default async function LogoutGuardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await logoutGuard();
  return <>{children}</>;
}
