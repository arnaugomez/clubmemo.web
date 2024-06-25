"use server";

import { redirect } from "next/navigation";
import { authLocator } from "../../auth-locator";

/**
 * Logs out the user and redirects to the landing page
 */
export async function logoutAction() {
  const useCase = await authLocator.LogoutUseCase();
  await useCase.execute();

  redirect("/");
}
