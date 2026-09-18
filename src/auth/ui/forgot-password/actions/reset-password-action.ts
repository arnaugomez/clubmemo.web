"use server";
import * as Effect from "effect/Effect";
import * as Result from "effect/Result";
import * as Schema from "effect/Schema";
import { ResetPasswordUseCaseService } from "@/src/auth/layers/layer_reset-password-use-case";
import { runServer } from "@/src/common/effect/server-runtime";
import { ActionErrorHandler } from "@/src/common/ui/actions/action-error-handler";
import {
  type ResetPasswordActionModel,
  ResetPasswordActionSchema,
} from "../schemas/reset-password-action-schema";

/**
 * Changes the password of a user. Used when the user forgot the password and
 * was sent a password reset code.
 *
 * @param input The data of the user and the new password
 */
export async function resetPasswordAction(input: ResetPasswordActionModel) {
  return runServer(
    Effect.gen(function* () {
      {
        const outcome = yield* Effect.result(
          Effect.gen(function* () {
            const parsed = yield* Schema.decodeUnknownEffect(
              ResetPasswordActionSchema,
            )(input);

            const useCase = yield* ResetPasswordUseCaseService;
            yield* useCase.execute(parsed);
          }),
        );
        if (Result.isFailure(outcome)) {
          const e = outcome.failure;
          return ActionErrorHandler.handle(e);
        }
      }
    }),
  );
}
