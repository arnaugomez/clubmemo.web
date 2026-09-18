"use server";
import * as Effect from "effect/Effect";
import * as Result from "effect/Result";
import * as Schema from "effect/Schema";
import { DeleteAdminResourceUseCaseService } from "@/src/admin/layers/layer_delete-admin-resource-use-case";
import { runServer } from "@/src/common/effect/server-runtime";
import { ActionErrorHandler } from "@/src/common/ui/actions/action-error-handler";
import { ActionResponse } from "@/src/common/ui/models/server-form-errors";
import { AdminResourceTypeModel } from "../../domain/models/admin-resource-model";
import type { DeleteAdminResourceUseCaseInputModel } from "../../domain/use-cases/delete-admin-resource-use-case";
import {
  DeleteAdminResourceActionSchema,
  DeleteAdminResourceActionSchemaForSessions,
} from "../schemas/delete-admin-resource-action-schema";

/**
 * Server action for deleting a resource in the admin panel. It receives the
 * id of the resource to delete, validates the input, and then calls the use
 * case. If the input is invalid or the user does not have permission to delete
 * the resource, it returns the errors to the client. Otherwise, it returns
 * a success response.
 */
export async function deleteAdminResourceAction(
  input: DeleteAdminResourceUseCaseInputModel,
) {
  return runServer(
    Effect.gen(function* () {
      {
        const outcome = yield* Effect.result(
          Effect.gen(function* () {
            const parsed = yield* Schema.decodeUnknownEffect(
              input.resourceType === AdminResourceTypeModel.sessions
                ? DeleteAdminResourceActionSchemaForSessions
                : DeleteAdminResourceActionSchema,
            )(input);
            const useCase = yield* DeleteAdminResourceUseCaseService;
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
