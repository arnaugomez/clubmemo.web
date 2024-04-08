"use server";
import { locator } from "@/src/core/app/locator";
import { waitMilliseconds } from "@/src/core/app/utils/promises";
import { authLocator } from "@/src/core/auth/auth-locator";
import {
  IncorrectPasswordError,
  UserDoesNotExistError,
} from "@/src/core/auth/domain/errors/auth-errors";
import { ActionResponse } from "@/src/ui/models/server-form-errors";
import { fetchSession } from "../../auth/fetch/fetch-session";

interface DeleteUserActionModel {
  password: string;
  confirmation: string;
}

export async function deleteUserAction(data: DeleteUserActionModel) {
  try {
    const { user } = await fetchSession();
    if (!user) throw new UserDoesNotExistError();
    if (data.confirmation != user.email)
      return ActionResponse.formError({
        name: "confirmation",
        message: "Texto de confirmación incorrecto",
        type: "invalidConfirmation",
      });

    const userId = user.id;

    await locator.AuthService().checkPasswordIsCorrect({
      userId,
      password: data.password,
    });

    const deleteUserUseCase = await authLocator.DeleteUserUseCase();
    await deleteUserUseCase.execute(userId);
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
      // TODO: log error report
      console.error(e);
      return ActionResponse.formGlobalError("general");
    }
  }
}
