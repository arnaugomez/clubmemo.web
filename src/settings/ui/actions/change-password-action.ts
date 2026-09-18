"use server";
import * as Effect from "effect/Effect";
import * as Result from "effect/Result";
import * as Schema from "effect/Schema";
import { IncorrectPasswordError } from "@/src/auth/domain/errors/auth-errors";
import { ChangePasswordUseCaseService } from "@/src/auth/layers/layer_change-password-use-case";
import { runServer } from "@/src/common/effect/server-runtime";
import { ActionErrorHandler } from "@/src/common/ui/actions/action-error-handler";
import { ActionResponse } from "@/src/common/ui/models/server-form-errors";
import type { ChangePasswordActionModel } from "../schemas/change-password-action-schema";
import { ChangePasswordActionSchema } from "../schemas/change-password-action-schema";

export async function changePasswordAction(input: ChangePasswordActionModel) {
  return runServer(
    Effect.gen(function* () {
      {
        const outcome = yield* Effect.result(
          Effect.gen(function* () {
            const parsed = yield* Schema.decodeUnknownEffect(
              ChangePasswordActionSchema,
            )(input);

            const changePasswordUseCase = yield* ChangePasswordUseCaseService;
            yield* changePasswordUseCase.execute({
              password: parsed.password,
              newPassword: parsed.newPassword,
            });
          }),
        );
        if (Result.isFailure(outcome)) {
          const e = outcome.failure;
          if (e instanceof IncorrectPasswordError) {
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
