"use server";
import * as Effect from "effect/Effect";
import * as Result from "effect/Result";
import * as Schema from "effect/Schema";
import { redirect } from "next/navigation";
import { InvalidTokenError } from "@/src/auth/domain/errors/auth-errors";
import { VerifyEmailUseCaseService } from "@/src/auth/layers/layer_verify-email-use-case";
import { runServer } from "@/src/common/effect/server-runtime";
import { ActionErrorHandler } from "@/src/common/ui/actions/action-error-handler";
import { ActionResponse } from "@/src/common/ui/models/server-form-errors";
import type { VerifyEmailActionModel } from "../schemas/verify-email-action-schema";
import { VerifyEmailActionSchema } from "../schemas/verify-email-action-schema";

/**
 * Server Action to verify the email of a user. When a user signs up, they receive
 * an email with a code to verify their email. This action checks that the code is
 * correct and marks the email as verified.
 */
export async function verifyEmailAction(input: VerifyEmailActionModel) {
  return runServer(
    Effect.gen(function* () {
      {
        const outcome = yield* Effect.result(
          Effect.gen(function* () {
            const { code } = yield* Schema.decodeUnknownEffect(
              VerifyEmailActionSchema,
            )(input);

            const useCase = yield* VerifyEmailUseCaseService;
            yield* useCase.execute(code);
          }),
        );
        if (Result.isFailure(outcome)) {
          const e = outcome.failure;
          if (e instanceof InvalidTokenError) {
            return ActionResponse.formError("code", {
              type: "invalidCode",
              message: "Código incorrecto",
            });
          }
          return ActionErrorHandler.handle(e);
        }
      }

      redirect(`/home`);
    }),
  );
}
