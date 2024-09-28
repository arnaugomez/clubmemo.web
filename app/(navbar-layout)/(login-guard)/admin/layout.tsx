import { fetchSession } from "@/src/auth/ui/fetch/fetch-session";
import { redirect } from "next/navigation";
import type { PropsWithChildren } from "react";

/**
 * Checks that the user is an admin. Otherwise, it redirects to the home page.
 */
async function adminGuard() {
  const result = await fetchSession();
  if (!result.user?.isAdmin) {
    redirect("/home");
  }
}

/**
 * Applies the `loginGuard` guard to the pages inside this layout
 */
export default async function AdminGuardLayout({
  children,
}: PropsWithChildren) {
  await adminGuard();
  return <>{children}</>;
}
