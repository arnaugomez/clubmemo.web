import * as Effect from "effect/Effect";
import { ExternalServiceError } from "@/src/common/effect/errors";
import { ClientFileUploadService } from "../../domain/interfaces/client-file-upload-service";
import { uploadFileAction } from "../actions/upload-file-action";
import type { UploadFileActionModel } from "../schemas/upload-file-action-schema";

/** Request permission, upload bytes, then expose the URL to the editing form. */
export const uploadFileWorkflow = Effect.fn("UploadFile.browser")(function* (
  input: Omit<UploadFileActionModel, "contentType"> & { file: File },
) {
  const response = yield* Effect.tryPromise({
    try: () =>
      uploadFileAction({
        collection: input.collection,
        field: input.field,
        contentType: input.file.type,
      }),
    catch: (cause) =>
      new ExternalServiceError({ operation: "UploadFile.request", cause }),
  });
  if (response.data) {
    const storage = yield* ClientFileUploadService;
    yield* storage.uploadPresignedUrl({
      file: input.file,
      presignedUrl: response.data.presignedUrl,
    });
  }
  return response;
});
