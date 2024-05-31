import type { PresignedUrlModel } from "../models/presigned-url-model";

/**
 * Repository for file uploads.
 *
 * It keeps track of the uploaded files so that there are no storage leaks in
 * the external storage service, and we do not incur in extra costs by keeping
 * unused files.
 *
 * Each file can have multiple versions, but only one is the current version.
 * The current version is the one that is being used in the application. The
 * rest of the versions are considered outdated and can be scheduled for
 * deletion.
 */
export interface FileUploadsRepository {
  /**
   * Creates and registers a file upload object to keep track of the uploaded file
   *
   * @param input Data of the newly uploaded file
   * @returns The created file upload, including the presigned url to upload the file
   */
  create(
    input: CreateFileUploadInputModel,
  ): Promise<CreateFileUploadOutputModel>;

  /**
   * Sets a file upload as the current version of the file
   * @param url the url of the file to set as current
   */
  setCurrent(url: string): Promise<void>;

  /**
   * Deletes all the outdated versions of a file
   */
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
