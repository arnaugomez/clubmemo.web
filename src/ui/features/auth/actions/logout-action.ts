"use server";

import { locator } from "@/src/core/app/locator";
import { checkSessionProvider } from "@/src/ui/features/auth/providers/check-session-provider";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function logoutAction() {
  const { session } = await checkSessionProvider();
  if (!session) {
    redirect("/");
  }
  const authService = locator.AuthService();

  await authService.invalidateSession(session.id);

  const sessionCookie = authService.createBlankSessionCookie();
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );
  redirect("/");
}
