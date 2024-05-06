"use server";
import { authLocator } from "@/src/auth/auth-locator";
import {
  IncorrectPasswordError,
  UserDoesNotExistError,
} from "@/src/auth/domain/errors/auth-errors";
import { waitMilliseconds } from "@/src/common/domain/utils/promises";
import { ActionResponse } from "@/src/common/ui/models/server-form-errors";
import { cookies } from "next/headers";
import type { z } from "zod";
import { fetchSession } from "../../../auth/ui/fetch/fetch-session";
import { ChangePasswordSchema } from "../schemas/change-password-schema";

export async function changePasswordAction(
  data: z.infer<typeof ChangePasswordSchema>,
) {
  try {
    const parsed = ChangePasswordSchema.parse(data);

    const { user } = await fetchSession();
    if (!user) throw new UserDoesNotExistError();
    const userId = user.id;

    const changePasswordUseCase = await authLocator.ChangePasswordUseCase();
    const sessionCookie = await changePasswordUseCase.execute({
      userId,
      password: parsed.password,
      newPassword: parsed.newPassword,
    });

    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    );
  } catch (e) {
    if (e instanceof UserDoesNotExistError) {
      return ActionResponse.formGlobalError("userDoesNotExist");
    } else if (e instanceof IncorrectPasswordError) {
      await waitMilliseconds(800); // Prevent brute-force attacks
      return ActionResponse.formError({
        name: "password",
        message: "Contraseña incorrecta",
        type: "invalidCredentials",
      });
    } else {
      // TODO: handle ZodError
      console.error(e);
      return ActionResponse.formGlobalError("general");
    }
  }
}
