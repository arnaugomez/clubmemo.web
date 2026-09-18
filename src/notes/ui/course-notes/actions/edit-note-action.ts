"use server";
import * as Effect from "effect/Effect";
import * as Result from "effect/Result";
import * as Schema from "effect/Schema";
import { revalidatePath } from "next/cache";
import { runServer } from "@/src/common/effect/server-runtime";
import { ActionErrorHandler } from "@/src/common/ui/actions/action-error-handler";
import { ActionResponse } from "@/src/common/ui/models/server-form-errors";
import { UpdateNoteUseCaseService } from "@/src/notes/layers/layer_update-note-use-case";
import type { EditNoteActionModel } from "../schemas/edit-note-action-schema";
import { EditNoteActionSchema } from "../schemas/edit-note-action-schema";

export async function editNoteAction(input: EditNoteActionModel) {
  return runServer(
    Effect.gen(function* () {
      {
        const outcome = yield* Effect.result(
          Effect.gen(function* () {
            const parsed =
              yield* Schema.decodeUnknownEffect(EditNoteActionSchema)(input);

            const updateNoteUseCase = yield* UpdateNoteUseCaseService;
            const newNote = yield* updateNoteUseCase.execute(parsed);

            revalidatePath("/courses/detail");
            return ActionResponse.formSuccess(newNote?.data);
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
