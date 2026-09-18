"use server";
import * as Effect from "effect/Effect";
import * as Result from "effect/Result";
import * as Schema from "effect/Schema";
import { UserDoesNotExistError } from "@/src/auth/domain/errors/auth-errors";
import { ForgotPasswordUseCaseService } from "@/src/auth/layers/layer_forgot-password-use-case";
import { runServer } from "@/src/common/effect/server-runtime";
import { ActionErrorHandler } from "@/src/common/ui/actions/action-error-handler";
import { ActionResponse } from "@/src/common/ui/models/server-form-errors";
import type { ForgotPasswordActionModel } from "../schemas/forgot-password-action-schema";
import { ForgotPasswordActionSchema } from "../schemas/forgot-password-action-schema";

/**
 * Sends an email to the user with a link to reset the password.
 * @param input Data with the email of the user
 */
export async function forgotPasswordAction(input: ForgotPasswordActionModel) {
  return runServer(
    Effect.gen(function* () {
      {
        const outcome = yield* Effect.result(
          Effect.gen(function* () {
            const { email } = yield* Schema.decodeUnknownEffect(
              ForgotPasswordActionSchema,
            )(input);
            const useCase = yield* ForgotPasswordUseCaseService;
            yield* useCase.execute(email);
          }),
        );
        if (Result.isFailure(outcome)) {
          const e = outcome.failure;
          if (e instanceof UserDoesNotExistError) {
            return ActionResponse.formError("email", {
              message: "No existe un usuario con ese correo",
              type: "userDoesNotExist",
            });
          }
          return ActionErrorHandler.handle(e);
        }
      }
    }),
  );
}
