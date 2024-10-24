"use server";
import {
  IncorrectPasswordError,
  InvalidConfirmationError,
} from "@/src/auth/domain/errors/auth-errors";
import { waitMilliseconds } from "@/src/common/domain/utils/promise";
import { ActionErrorHandler } from "@/src/common/ui/actions/action-error-handler";
import { ActionResponse } from "@/src/common/ui/models/server-form-errors";
import type { DeleteUserActionModel } from "../schemas/delete-user-action-schema";
import { DeleteUserActionSchema } from "../schemas/delete-user-action-schema";
import { locator_auth_DeleteUserUseCase } from "@/src/auth/locators/locator_delete-user-use-case";

export async function deleteUserAction(input: DeleteUserActionModel) {
  try {
    const parsed = DeleteUserActionSchema.parse(input);

    const deleteUserUseCase = locator_auth_DeleteUserUseCase();
    await deleteUserUseCase.execute(parsed);
  } catch (e) {
    if (e instanceof InvalidConfirmationError) {
      return ActionResponse.formError("confirmation", {
        message: "Texto de confirmación incorrecto",
        type: "invalidConfirmation",
      });
    } else if (e instanceof IncorrectPasswordError) {
      await waitMilliseconds(800); // Prevent brute-force attacks
      return ActionResponse.formError("password", {
        message: "Contraseña incorrecta",
        type: "invalidCredentials",
      });
    }
    return ActionErrorHandler.handle(e);
  }
}
