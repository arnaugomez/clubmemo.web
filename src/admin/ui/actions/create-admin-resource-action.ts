"use server";
import * as Effect from "effect/Effect";
import * as Result from "effect/Result";
import * as Schema from "effect/Schema";
import { CreateAdminResourceUseCaseService } from "@/src/admin/layers/layer_create-admin-resource-use-case";
import { runServer } from "@/src/common/effect/server-runtime";
import { ActionErrorHandler } from "@/src/common/ui/actions/action-error-handler";
import { ActionResponse } from "@/src/common/ui/models/server-form-errors";
import type { CreateAdminResourceUseCaseInputModel } from "../../domain/use-cases/create-admin-resource-use-case";
import { CreateAdminResourceActionSchema } from "../schemas/create-admin-resource-action-schema";

/**
 * Server action for creating a new resource in the admin panel. It receives the
 * data from the resource creation form, validates it, and then calls the use
 * case If the data is invalid or the user does not have permission to create
 * the resource, it returns the errors to the client.
 */
export async function createAdminResourceAction(
  input: CreateAdminResourceUseCaseInputModel,
) {
  return runServer(
    Effect.gen(function* () {
      {
        const outcome = yield* Effect.result(
          Effect.gen(function* () {
            const parsed = yield* Schema.decodeUnknownEffect(
              CreateAdminResourceActionSchema,
            )(input);
            const useCase = yield* CreateAdminResourceUseCaseService;
            const result = yield* useCase.execute(parsed);
            return ActionResponse.formSuccess(result);
          }),
        );
        if (Result.isFailure(outcome)) {
          const e = outcome.failure;
          return ActionErrorHandler.handle(e);
        } else {
          return outcome.success;
        }
      }
    }),
  );
}
