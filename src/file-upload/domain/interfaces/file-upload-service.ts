import type { PresignedUrlModel } from "../models/presigned-url-model";

export interface GeneratePresignedUrlInputModel {
  key: string;
  contentType: string;
}
export interface FileUploadService {
  generatePresignedUrl(
    input: GeneratePresignedUrlInputModel,
  ): Promise<PresignedUrlModel>;

  deleteFile(key: string): Promise<void>;
}
