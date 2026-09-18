"use server";
import * as Effect from "effect/Effect";
import * as Result from "effect/Result";
import * as Schema from "effect/Schema";
import { redirect } from "next/navigation";
import { UserAlreadyExistsError } from "@/src/auth/domain/errors/auth-errors";
import { SignupUseCaseService } from "@/src/auth/layers/layer_signup-use-case";
import { runServer } from "@/src/common/effect/server-runtime";
import { ActionErrorHandler } from "@/src/common/ui/actions/action-error-handler";
import { ActionResponse } from "@/src/common/ui/models/server-form-errors";
import type { SignupActionModel } from "../schemas/signup-action-schema";
import { SignupActionSchema } from "../schemas/signup-action-schema";

/**
 * Action to create a new user account with an email and password.
 * @param input The email and password of the new user
 */
export async function signupAction(input: SignupActionModel) {
  return runServer(
    Effect.gen(function* () {
      {
        const outcome = yield* Effect.result(
          Effect.gen(function* () {
            const parsed =
              yield* Schema.decodeUnknownEffect(SignupActionSchema)(input);

            const useCase = yield* SignupUseCaseService;
            yield* useCase.execute(parsed);
          }),
        );
        if (Result.isFailure(outcome)) {
          const e = outcome.failure;
          if (e instanceof UserAlreadyExistsError) {
            return ActionResponse.formError("email", {
              type: "exists",
              message: "Ya existe un usuario con ese correo electrónico",
            });
          }
          return ActionErrorHandler.handle(e);
        }
      }

      redirect(`/auth/verify-email`);
    }),
  );
}
