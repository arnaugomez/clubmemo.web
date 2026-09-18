"use server";
import * as Effect from "effect/Effect";
import * as Result from "effect/Result";
import * as Schema from "effect/Schema";
import { revalidatePath } from "next/cache";
import { runServer } from "@/src/common/effect/server-runtime";
import { ActionErrorHandler } from "@/src/common/ui/actions/action-error-handler";
import { ActionResponse } from "@/src/common/ui/models/server-form-errors";
import { DeleteNoteUseCaseService } from "@/src/notes/layers/layer_delete-note-use-case";
import type { DeleteNoteActionModel } from "../schemas/delete-note-action-schema";
import { DeleteNoteActionSchema } from "../schemas/delete-note-action-schema";

export async function deleteNoteAction(input: DeleteNoteActionModel) {
  return runServer(
    Effect.gen(function* () {
      {
        const outcome = yield* Effect.result(
          Effect.gen(function* () {
            const parsed = yield* Schema.decodeUnknownEffect(
              DeleteNoteActionSchema,
            )(input);

            const useCase = yield* DeleteNoteUseCaseService;
            yield* useCase.execute(parsed);

            revalidatePath("/courses/detail");
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
