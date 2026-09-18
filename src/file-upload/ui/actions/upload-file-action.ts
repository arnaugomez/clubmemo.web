"use server";
import * as Effect from "effect/Effect";
import * as Result from "effect/Result";
import * as Schema from "effect/Schema";
import { runServer } from "@/src/common/effect/server-runtime";

import { ActionErrorHandler } from "@/src/common/ui/actions/action-error-handler";
import type { FormActionResponse } from "@/src/common/ui/models/server-form-errors";
import { ActionResponse } from "@/src/common/ui/models/server-form-errors";
import type { CreateFileUploadOutputModel } from "@/src/file-upload/domain/interfaces/file-uploads-repository";
import { UploadFileUseCaseService } from "@/src/file-upload/layers/layer_upload-file-use-case";
import {
  type UploadFileActionModel,
  UploadFileActionSchema,
} from "../schemas/upload-file-action-schema";

export async function uploadFileAction(
  input: UploadFileActionModel,
): Promise<FormActionResponse<CreateFileUploadOutputModel | null>> {
  return runServer(
    Effect.gen(function* () {
      {
        const outcome = yield* Effect.result(
          Effect.gen(function* () {
            const parsed = yield* Schema.decodeUnknownEffect(
              UploadFileActionSchema,
            )(input);

            const useCase = yield* UploadFileUseCaseService;
            const file = yield* useCase.execute(parsed);

            return ActionResponse.formSuccess(file);
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
