import { fetchSession } from "@/src/auth/ui/fetch/fetch-session";
import { notFound, redirect } from "next/navigation";

async function loginGuard() {
  const result = await fetchSession();
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
