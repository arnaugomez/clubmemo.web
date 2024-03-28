"use server";
import { waitMilliseconds } from "@/src/core/app/utils/promises";
import { authLocator } from "@/src/core/auth/domain/auth-locator";
import {
  IncorrectPasswordError,
  UserDoesNotExistError,
} from "@/src/core/auth/domain/errors/auth-errors";
import { ActionResponse } from "@/src/ui/view-models/server-form-errors";
import { cookies } from "next/headers";
import { z } from "zod";
import { fetchSession } from "../../auth/fetch/fetch-session";
import { ChangePasswordSchema } from "../schemas/change-password-schema";

export async function changePasswordAction(
  data: z.infer<typeof ChangePasswordSchema>,
) {
  try {
    const { password } = ChangePasswordSchema.parse(data);

    const { user } = await fetchSession();
    if (!user) throw new UserDoesNotExistError();
    const userId = user.id;

    const changePasswordUseCase = await authLocator.ChangePasswordUseCase();
    const sessionCookie = await changePasswordUseCase.execute({
      userId,
      password,
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
      console.log(e);
      return ActionResponse.formGlobalError("general");
    }
  }
}
