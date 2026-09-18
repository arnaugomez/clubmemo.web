"use server";
import * as Effect from "effect/Effect";
import * as Result from "effect/Result";
import * as Schema from "effect/Schema";
import {
  IncorrectPasswordError,
  InvalidConfirmationError,
} from "@/src/auth/domain/errors/auth-errors";
import { DeleteUserUseCaseService } from "@/src/auth/layers/layer_delete-user-use-case";
import { runServer } from "@/src/common/effect/server-runtime";
import { ActionErrorHandler } from "@/src/common/ui/actions/action-error-handler";
import { ActionResponse } from "@/src/common/ui/models/server-form-errors";
import type { DeleteUserActionModel } from "../schemas/delete-user-action-schema";
import { DeleteUserActionSchema } from "../schemas/delete-user-action-schema";

export async function deleteUserAction(input: DeleteUserActionModel) {
  return runServer(
    Effect.gen(function* () {
      {
        const outcome = yield* Effect.result(
          Effect.gen(function* () {
            const parsed = yield* Schema.decodeUnknownEffect(
              DeleteUserActionSchema,
            )(input);

            const deleteUserUseCase = yield* DeleteUserUseCaseService;
            yield* deleteUserUseCase.execute(parsed);
          }),
        );
        if (Result.isFailure(outcome)) {
          const e = outcome.failure;
          if (e instanceof InvalidConfirmationError) {
            return ActionResponse.formError("confirmation", {
              message: "Texto de confirmación incorrecto",
              type: "invalidConfirmation",
            });
          } else if (e instanceof IncorrectPasswordError) {
            yield* Effect.sleep(800); // Prevent brute-force attacks
            return ActionResponse.formError("password", {
              message: "Contraseña incorrecta",
              type: "invalidCredentials",
            });
          }
          return ActionErrorHandler.handle(e);
        }
      }
    }),
  );
}
