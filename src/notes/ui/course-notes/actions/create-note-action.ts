"use server";
import * as Effect from "effect/Effect";
import * as Result from "effect/Result";
import * as Schema from "effect/Schema";
import { revalidatePath } from "next/cache";
import { runServer } from "@/src/common/effect/server-runtime";
import { ActionErrorHandler } from "@/src/common/ui/actions/action-error-handler";
import { ActionResponse } from "@/src/common/ui/models/server-form-errors";
import { CreateNoteUseCaseService } from "@/src/notes/layers/layer_create-note-use-case";
import type { CreateNoteActionModel } from "../schemas/create-note-action-schema";
import { CreateNoteActionSchema } from "../schemas/create-note-action-schema";

export async function createNoteAction(input: CreateNoteActionModel) {
  return runServer(
    Effect.gen(function* () {
      {
        const outcome = yield* Effect.result(
          Effect.gen(function* () {
            const parsed = yield* Schema.decodeUnknownEffect(
              CreateNoteActionSchema,
            )(input);

            const createNoteUseCase = yield* CreateNoteUseCaseService;
            const note = yield* createNoteUseCase.execute(parsed);

            revalidatePath("/courses/detail");
            return ActionResponse.formSuccess(note.data);
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
