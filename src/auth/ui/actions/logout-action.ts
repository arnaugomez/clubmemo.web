"use server";

import { locator } from "@/src/common/locator";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { authLocator } from "../../auth-locator";

export async function logoutAction() {
  const getSessionUseCase = authLocator.GetSessionUseCase();
  const { session } = await getSessionUseCase.execute();
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
