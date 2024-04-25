"use server";

import { fetchSession } from "@/src/auth/ui/fetch/fetch-session";
import { locator } from "@/src/common/locator";
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
