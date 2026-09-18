import * as Effect from "effect/Effect";
import { ExternalServiceError } from "@/src/common/effect/errors";
import { FileUploadNotSuccessfulError } from "../../domain/errors/file-upload-errors";
import type {
  ClientFileUploadService,
  UploadPresignedUrlInputModel,
} from "../../domain/interfaces/client-file-upload-service";

/**
 * Implementation of `ClientFileUploadService` that uploads files to an S3 bucket
 */
export class ClientFileUploadServiceS3Impl implements ClientFileUploadService {
  uploadPresignedUrl = Effect.fn(
    "ClientFileUploadServiceS3Impl.uploadPresignedUrl",
  )(function* (
    this: ClientFileUploadServiceS3Impl,
    { file, presignedUrl: { url, fields } }: UploadPresignedUrlInputModel,
  ) {
    const formData = new FormData();
    for (const [key, value] of Object.entries(fields)) {
      formData.append(key, value);
    }
    formData.append("file", file);

    const uploadResponse = yield* Effect.tryPromise({
      try: (signal) =>
        fetch(url, {
          method: "POST",
          body: formData,
          signal,
        }),
      catch: (cause) =>
        new ExternalServiceError({
          operation: "ClientFileUploadServiceS3Impl.uploadPresignedUrl",
          cause,
        }),
    });

    if (!uploadResponse.ok) {
      return yield* Effect.fail(new FileUploadNotSuccessfulError());
    }
  }).bind(this);
}
