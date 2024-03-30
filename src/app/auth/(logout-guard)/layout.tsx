import { fetchSession } from "@/src/ui/features/auth/fetch/fetch-session";
import { redirect } from "next/navigation";

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
}: Readonly<{
  children: React.ReactNode;
}>) {
  await logoutGuard();
  return <>{children}</>;
}
