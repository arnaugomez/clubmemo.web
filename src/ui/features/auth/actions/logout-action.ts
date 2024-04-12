"use server";

import { locator } from "@/src/core/common/locator";
import { fetchSession } from "@/src/ui/features/auth/fetch/fetch-session";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function logoutAction() {
  const { session } = await fetchSession();
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
