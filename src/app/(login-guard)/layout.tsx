import { checkSessionProvider } from "@/src/ui/features/auth/providers/check-session-provider";
import { notFound, redirect } from "next/navigation";

async function loginGuard() {
  const result = await checkSessionProvider();
  if (!result.session) {
    notFound();
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
