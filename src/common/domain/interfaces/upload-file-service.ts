import type { PresignedUrlModel } from "../models/presigned-url-model";

export interface GeneratePresignedUrlInputModel {
  key: string;
  contentType: string;
}

export interface UploadFileService {
  generatePresignedUrl(
    input: GeneratePresignedUrlInputModel,
  ): Promise<PresignedUrlModel>;
}
