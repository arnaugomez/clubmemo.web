"use server";

import { redirect } from "next/navigation";
import { locator_auth_LogoutUseCase } from "../../locators/locator_logout-use-case";

/**
 * Logs out the user and redirects to the landing page
 */
export async function logoutAction() {
  const useCase = locator_auth_LogoutUseCase();
  await useCase.execute();

  redirect("/");
}
