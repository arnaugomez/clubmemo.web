import { DeleteObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";
import * as Effect from "effect/Effect";
import { ExternalServiceError } from "@/src/common/effect/errors";
import type { EnvService } from "../../../common/domain/interfaces/env-service";
import type {
  FileUploadService,
  GeneratePresignedUrlInputModel,
} from "../../domain/interfaces/file-upload-service";

/**
 * Implementation of `FileUploadService` that uses the AWS S3 SDK
 */
export class FileUploadServiceS3Impl implements FileUploadService {
  private readonly client: S3Client;
  close() {
    this.client.destroy();
  }

  constructor(private readonly envService: EnvService) {
    this.client = new S3Client({ region: envService.awsRegion });
  }

  generatePresignedUrl = Effect.fn(
    "FileUploadServiceS3Impl.generatePresignedUrl",
  )(function* (
    this: FileUploadServiceS3Impl,
    input: GeneratePresignedUrlInputModel,
  ) {
    const { key, contentType } = input;
    const { url, fields } = yield* Effect.tryPromise({
      try: () =>
        createPresignedPost(this.client, {
          Bucket: this.envService.awsBucketName,
          Key: key,
          Conditions: [
            ["content-length-range", 0, 5 * 1024 * 1024], // up to 5 MB
            ["starts-with", "$Content-Type", contentType],
          ],
          Fields: {
            acl: "public-read",
            "Content-Type": contentType,
            "Cache-Control": "max-age=31536000",
          },
          Expires: 600, // Seconds before the presigned post expires. 3600 by default.
        }),
      catch: (cause) =>
        new ExternalServiceError({
          operation: "FileUploadServiceS3Impl.generatePresignedUrl",
          cause,
        }),
    });

    return { url, fields };
  }).bind(this);

  deleteFile = Effect.fn("FileUploadServiceS3Impl.deleteFile")(function* (
    this: FileUploadServiceS3Impl,
    key: string,
  ) {
    yield* Effect.tryPromise({
      try: (abortSignal) =>
        this.client.send(
          new DeleteObjectCommand({
            Bucket: this.envService.awsBucketName,
            Key: key,
          }),
          { abortSignal },
        ),
      catch: (cause) =>
        new ExternalServiceError({
          operation: "FileUploadServiceS3Impl.deleteFile",
          cause,
        }),
    });
  }).bind(this);
}
