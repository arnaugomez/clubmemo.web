import type { PresignedUrlModel } from "../models/presigned-url-model";

export interface GeneratePresignedUrlInputModel {
  key: string;
  contentType: string;
}

export interface FileUploadService {
  generatePresignedUrl(
    input: GeneratePresignedUrlInputModel,
  ): Promise<PresignedUrlModel>;

  /** Does not throw an error if the file does not exist */
  deleteFile(key: string): Promise<void>;
}
