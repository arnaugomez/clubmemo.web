"use server";

import { redirect } from "next/navigation";
import { authLocator } from "../../auth-locator";

export async function logoutAction() {
  const useCase = await authLocator.LogoutUseCase();
  await useCase.execute();

  redirect("/");
}
