import type { PresignedUrlModel } from "../models/presigned-url-model";

/**
 * Service to manage file uploads to an external storage service from the server
 * side
 */
export interface FileUploadService {
  /**
   * Generates a presigned URL to upload a file to an external storage service
   * from the client side (the web browser)
   *
   * @param input The data of the file to upload
   * @returns The presigned URL to upload the file from the client side (the web
   * browser)
   */
  generatePresignedUrl(
    input: GeneratePresignedUrlInputModel,
  ): Promise<PresignedUrlModel>;

  /**
   * Deletes a file, removing it permanently from the external storage service.
   *
   * Does not throw an error if the file does not exist.
   *
   * @param key The key of the file to delete
   */
  deleteFile(key: string): Promise<void>;
}

export interface GeneratePresignedUrlInputModel {
  key: string;
  contentType: string;
}
