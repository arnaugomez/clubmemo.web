"use server";
import * as Effect from "effect/Effect";
import * as Result from "effect/Result";
import * as Schema from "effect/Schema";
import { runServer } from "@/src/common/effect/server-runtime";

import { ActionErrorHandler } from "@/src/common/ui/actions/action-error-handler";
import type { FormActionResponse } from "@/src/common/ui/models/server-form-errors";
import { ActionResponse } from "@/src/common/ui/models/server-form-errors";
import { TagsRepository } from "@/src/tags/layers/layer_tags-repository";
import type { GetTagSuggestionsActionModel } from "../schemas/get-tag-suggestions-action-schema";
import { GetTagSuggestionsActionSchema } from "../schemas/get-tag-suggestions-action-schema";

export async function getTagSuggestionsAction(
  input: GetTagSuggestionsActionModel,
): Promise<FormActionResponse<string[] | null>> {
  return runServer(
    Effect.gen(function* () {
      {
        const outcome = yield* Effect.result(
          Effect.gen(function* () {
            const { query } = yield* Schema.decodeUnknownEffect(
              GetTagSuggestionsActionSchema,
            )(input);

            const repository = yield* TagsRepository;
            const results = yield* repository.getSuggestions(query);

            return ActionResponse.formSuccess(results);
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
