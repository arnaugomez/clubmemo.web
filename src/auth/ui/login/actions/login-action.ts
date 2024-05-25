"use server";
import {
  IncorrectPasswordError,
  UserDoesNotExistError,
} from "@/src/auth/domain/errors/auth-errors";
import { waitMilliseconds } from "@/src/common/domain/utils/promises";
import { locator } from "@/src/common/locator";
import { ActionErrorHandler } from "@/src/common/ui/actions/action-error-handler";
import { ActionResponse } from "@/src/common/ui/models/server-form-errors";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { LoginActionModel } from "../schemas/login-action-schema";
import { LoginActionSchema } from "../schemas/login-action-schema";

export async function loginAction(input: LoginActionModel) {
  try {
    const data = LoginActionSchema.parse(input);
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
      return ActionResponse.formError("name", {
        message: "Credenciales inválidas",
        type: "invalidCredentials",
      });
    } else {
      return ActionErrorHandler.handle(e);
    }
  }
  redirect(`/home`);
}
