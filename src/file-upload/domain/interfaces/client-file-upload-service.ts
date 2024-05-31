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
  uploadPresignedUrl(input: UploadPresignedUrlInputModel): Promise<void>;
}

export interface UploadPresignedUrlInputModel {
  file: File;
  presignedUrl: PresignedUrlModel;
}
