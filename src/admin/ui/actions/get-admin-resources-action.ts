"use server";
import * as Effect from "effect/Effect";
import * as Result from "effect/Result";
import * as Schema from "effect/Schema";
import { GetAdminResourcesUseCaseService } from "@/src/admin/layers/layer_get-admin-resources-use-case";
import { runServer } from "@/src/common/effect/server-runtime";
import { ActionErrorHandler } from "@/src/common/ui/actions/action-error-handler";
import { ActionResponse } from "@/src/common/ui/models/server-form-errors";
import type { GetAdminResourcesUseCaseInputModel } from "../../domain/use-cases/get-admin-resources-use-case";
import { GetAdminResourcesActionSchema } from "../schemas/get-admin-resources-action-schema";

/**
 * Server action to retrieve a paginated list of resources from the admin panel.
 * It takes as parameters the resource type, the page number, the search filters
 * and the sort order.
 */
export async function getAdminResourcesAction(
  input: GetAdminResourcesUseCaseInputModel,
) {
  return runServer(
    Effect.gen(function* () {
      {
        const outcome = yield* Effect.result(
          Effect.gen(function* () {
            const parsed = yield* Schema.decodeUnknownEffect(
              GetAdminResourcesActionSchema,
            )(input);
            const useCase = yield* GetAdminResourcesUseCaseService;
            const result = yield* useCase.execute(parsed);
            return ActionResponse.formSuccess(
              result.toData((resourceData) => resourceData),
            );
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
