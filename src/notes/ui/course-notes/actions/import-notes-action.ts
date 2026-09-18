"use server";
import * as Effect from "effect/Effect";
import * as Result from "effect/Result";
import * as Schema from "effect/Schema";
import { InvalidFileFormatError } from "@/src/common/domain/models/app-errors";
import { runServer } from "@/src/common/effect/server-runtime";
import { ActionErrorHandler } from "@/src/common/ui/actions/action-error-handler";
import { ActionResponse } from "@/src/common/ui/models/server-form-errors";
import { ImportNotesUseCaseService } from "@/src/notes/layers/layer_import-notes-use-case";
import { ImportNotesActionSchema } from "../schemas/import-notes-action-schema";

export async function importNotesAction(formData: FormData) {
  return runServer(
    Effect.gen(function* () {
      {
        const outcome = yield* Effect.result(
          Effect.gen(function* () {
            if (!(formData instanceof FormData))
              return yield* Effect.fail(
                new Error("formData is not an instance of FormData."),
              );

            const parsed = yield* Schema.decodeUnknownEffect(
              ImportNotesActionSchema,
            )({
              file: formData.get("file"),
              courseId: formData.get("courseId"),
              importType: formData.get("importType"),
            });

            const importNotesUseCase = yield* ImportNotesUseCaseService;
            const result = yield* importNotesUseCase.execute({
              courseId: parsed.courseId,
              file: parsed.file,
              importType: parsed.importType,
            });

            return ActionResponse.formSuccess(result.map((e) => e.data));
          }),
        );
        if (Result.isFailure(outcome)) {
          const e = outcome.failure;
          if (e instanceof InvalidFileFormatError) {
            return ActionResponse.formError("file", {
              type: "invalidFileFormat",
              message: "Formato de archivo inválido",
            });
          }
          return ActionErrorHandler.handle(e);
        } else {
          return outcome.success;
        }
      }
    }),
  );
}
