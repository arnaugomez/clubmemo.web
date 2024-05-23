import type { PresignedUrlModel } from "../models/presigned-url-model";

export interface FileUploadsRepository {
  create(
    input: CreateFileUploadInputModel,
  ): Promise<CreateFileUploadOutputModel>;

  setCurrent(key: string): Promise<void>;

  getUrl(key: string): Promise<string | undefined>;

  deleteOutdated(): Promise<void>;
}

export interface CreateFileUploadInputModel {
  keyPrefix: string;
  fileName: string;
  contentType: string;
}

export interface CreateFileUploadOutputModel {
  key: string;
  presignedUrl: PresignedUrlModel;
}
