import * as Context from "effect/Context";
import type * as Effect from "effect/Effect";
import type { ExternalServiceError } from "@/src/common/effect/errors";
import type { FileUploadNotSuccessfulError } from "../errors/file-upload-errors";
import type { PresignedUrlModel } from "../models/presigned-url-model";

/**
 * Service to upload files to an external storage service from the client side (i.e., the browser)
 */
export interface ClientFileUploadService {
  /**
   * Uploads a file to a given presigned URL
   *
   * @param input The file and presigned URL to upload the file
   */
  uploadPresignedUrl(
    input: UploadPresignedUrlInputModel,
  ): Effect.Effect<void, ExternalServiceError | FileUploadNotSuccessfulError>;
}

export interface UploadPresignedUrlInputModel {
  file: File;
  presignedUrl: PresignedUrlModel;
}

export const ClientFileUploadService = Context.Service<ClientFileUploadService>(
  "clubmemo/file-upload/domain/interfaces/client-file-upload-service/ClientFileUploadService",
);
