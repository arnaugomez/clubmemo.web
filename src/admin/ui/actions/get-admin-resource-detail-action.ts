"use server";
import * as Effect from "effect/Effect";
import * as Result from "effect/Result";
import * as Schema from "effect/Schema";
import { GetAdminResourceDetailUseCaseService } from "@/src/admin/layers/layer_get-admin-resource-detail-use-case";
import { runServer } from "@/src/common/effect/server-runtime";
import { ActionErrorHandler } from "@/src/common/ui/actions/action-error-handler";
import { ActionResponse } from "@/src/common/ui/models/server-form-errors";
import type { GetAdminResourceDetailUseCaseInputModel } from "../../domain/use-cases/get-admin-resource-detail-use-case";
import { GetAdminResourceDetailActionSchema } from "../schemas/get-admin-resource-detail-action-schema";

/**
 * Server action to retrieve a resource from the admin panel. It receives the
 * data with the resource type and the id of the resource.
 */
export async function getAdminResourceDetailAction(
  input: GetAdminResourceDetailUseCaseInputModel,
) {
  return runServer(
    Effect.gen(function* () {
      {
        const outcome = yield* Effect.result(
          Effect.gen(function* () {
            const parsed = yield* Schema.decodeUnknownEffect(
              GetAdminResourceDetailActionSchema,
            )(input);
            const useCase = yield* GetAdminResourceDetailUseCaseService;
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
