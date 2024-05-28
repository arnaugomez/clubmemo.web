import type { PresignedUrlModel } from "../models/presigned-url-model";

export interface ClientFileUploadService {
  uploadPresignedUrl(input: UploadPresignedUrlInputModel): Promise<void>;
}

export interface UploadPresignedUrlInputModel {
  file: File;
  presignedUrl: PresignedUrlModel;
}
