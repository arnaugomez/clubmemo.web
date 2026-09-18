"use server";
import * as Effect from "effect/Effect";
import * as Result from "effect/Result";
import * as Schema from "effect/Schema";
import { runServer } from "@/src/common/effect/server-runtime";

import { ActionErrorHandler } from "@/src/common/ui/actions/action-error-handler";
import { ActionResponse } from "@/src/common/ui/models/server-form-errors";
import { GetNotesUseCaseService } from "@/src/notes/layers/layer_get-notes-use-case";
import type { PaginateNotesActionModel } from "../schemas/paginate-notes-action-model";
import { PaginateNotesActionSchema } from "../schemas/paginate-notes-action-model";

export async function paginateNotesAction(input: PaginateNotesActionModel) {
  return runServer(
    Effect.gen(function* () {
      {
        const outcome = yield* Effect.result(
          Effect.gen(function* () {
            const parsed = yield* Schema.decodeUnknownEffect(
              PaginateNotesActionSchema,
            )(input);
            const useCase = yield* GetNotesUseCaseService;
            const response = yield* useCase.execute(parsed);
            return ActionResponse.formSuccess(response.toData((e) => e.data));
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
