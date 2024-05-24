"use server";
import { authLocator } from "@/src/auth/auth-locator";
import {
  IncorrectPasswordError,
  UserDoesNotExistError,
} from "@/src/auth/domain/errors/auth-errors";
import { waitMilliseconds } from "@/src/common/domain/utils/promises";
import { locator } from "@/src/common/locator";
import { ActionErrorHandler } from "@/src/common/ui/actions/action-error-handler";
import { ActionResponse } from "@/src/common/ui/models/server-form-errors";
import { fetchSession } from "../../../auth/ui/fetch/fetch-session";
import type { DeleteUserActionModel } from "../schemas/delete-user-action-schema";
import { DeleteUserActionSchema } from "../schemas/delete-user-action-schema";

export async function deleteUserAction(input: DeleteUserActionModel) {
  try {
    const data = DeleteUserActionSchema.parse(input);
    const { user } = await fetchSession();
    if (!user) throw new UserDoesNotExistError();
    if (data.confirmation != user.email)
      return ActionResponse.formError("confirmation", {
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
    if (e instanceof IncorrectPasswordError) {
      await waitMilliseconds(800); // Prevent brute-force attacks
      return ActionResponse.formError("password", {
        message: "Contraseña incorrecta",
        type: "invalidCredentials",
      });
    }
    ActionErrorHandler.handle(e);
  }
}
