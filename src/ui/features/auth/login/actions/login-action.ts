"use server";
import { locator } from "@/src/core/app/locator";
import { waitMilliseconds } from "@/src/core/app/utils/promises";
import {
  IncorrectPasswordError,
  UserDoesNotExistError,
} from "@/src/core/auth/domain/errors/auth-errors";
import { LoginWithPasswordModel } from "@/src/core/auth/domain/interfaces/auth-service";
import { ActionResponse } from "@/src/ui/models/server-form-errors";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function loginAction(data: LoginWithPasswordModel) {
  try {
    const sessionCookie = await locator.AuthService().loginWithPassword(data);

    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    );
  } catch (e) {
    if (
      e instanceof UserDoesNotExistError ||
      e instanceof IncorrectPasswordError
    ) {
      await waitMilliseconds(800); // Prevent brute-force attacks
      return ActionResponse.formError({
        name: "password",
        message: "Credenciales inválidas",
        type: "invalidCredentials",
      });
    } else {
      // TODO: Log error
      console.error(e);
      return ActionResponse.formGlobalError("general");
    }
  }
  redirect(`/home`);
}
