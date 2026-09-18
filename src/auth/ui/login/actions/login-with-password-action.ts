"use server";
import * as Effect from "effect/Effect";
import * as Result from "effect/Result";
import * as Schema from "effect/Schema";
import { redirect } from "next/navigation";
import {
  IncorrectPasswordError,
  UserDoesNotExistError,
} from "@/src/auth/domain/errors/auth-errors";
import { LoginWithPasswordUseCaseService } from "@/src/auth/layers/layer_login-with-password-use-case";
import { runServer } from "@/src/common/effect/server-runtime";
import { ActionErrorHandler } from "@/src/common/ui/actions/action-error-handler";
import { ActionResponse } from "@/src/common/ui/models/server-form-errors";
import {
  type LoginWithPasswordActionModel,
  LoginWithPasswordActionSchema,
} from "../schemas/login-with-password-action-schema";

/**
 * Checks that the user credentials (email and password) are valid and creates a
 * new session to log in the user. Then, it redirects to the home page.
 *
 * @param input The credentials of the user: email and password
 */
export async function loginWithPasswordAction(
  input: LoginWithPasswordActionModel,
) {
  return runServer(
    Effect.gen(function* () {
      {
        const outcome = yield* Effect.result(
          Effect.gen(function* () {
            const parsed = yield* Schema.decodeUnknownEffect(
              LoginWithPasswordActionSchema,
            )(input);

            const useCase = yield* LoginWithPasswordUseCaseService;
            yield* useCase.execute(parsed);
          }),
        );
        if (Result.isFailure(outcome)) {
          const e = outcome.failure;
          if (
            e instanceof UserDoesNotExistError ||
            e instanceof IncorrectPasswordError
          ) {
            yield* Effect.sleep(800); // Prevent brute-force attacks
            return ActionResponse.formError("password", {
              message: "Credenciales inválidas",
              type: "invalidCredentials",
            });
          }
          return ActionErrorHandler.handle(e);
        }
      }
      redirect(`/home`);
    }),
  );
}
