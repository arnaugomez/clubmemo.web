import type { PresignedUrlModel } from "../models/presigned-url-model";

export interface FileUploadsRepository {
  create(
    input: CreateFileUploadInputModel,
  ): Promise<CreateFileUploadOutputModel>;

  setCurrent(url: string): Promise<void>;

  deleteOutdated(): Promise<void>;
}

export interface CreateFileUploadInputModel {
  keyPrefix: string;
  fileName: string;
  contentType: string;
}

export interface CreateFileUploadOutputModel {
  url: string;
  presignedUrl: PresignedUrlModel;
}
