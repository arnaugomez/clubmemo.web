"use server";
import * as Effect from "effect/Effect";
import * as Result from "effect/Result";
import * as Schema from "effect/Schema";
import { UpdateAdminResourceUseCaseService } from "@/src/admin/layers/layer_update-admin-resource-use-case";
import { runServer } from "@/src/common/effect/server-runtime";
import { ActionErrorHandler } from "@/src/common/ui/actions/action-error-handler";
import { ActionResponse } from "@/src/common/ui/models/server-form-errors";
import type { UpdateAdminResourceUseCaseInputModel } from "../../domain/use-cases/update-admin-resource-use-case";
import { UpdateAdminResourceActionSchema } from "../schemas/update-admin-resource-action-schema";

/**
 * Server action for updating a resource in the admin panel. It receives the
 * data with the resource type, the id of the resource, and the new data to
 * update. It validates the input and then calls the use case.
 * @returns Does not return anything if the action is successful. It is recommended
 * to reload the data after a successful update.
 */
export async function updateAdminResourceAction(
  input: UpdateAdminResourceUseCaseInputModel,
) {
  return runServer(
    Effect.gen(function* () {
      {
        const outcome = yield* Effect.result(
          Effect.gen(function* () {
            const parsed = yield* Schema.decodeUnknownEffect(
              UpdateAdminResourceActionSchema,
            )(input);
            const useCase = yield* UpdateAdminResourceUseCaseService;
            yield* useCase.execute(parsed);
            return ActionResponse.formSuccess(null);
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
