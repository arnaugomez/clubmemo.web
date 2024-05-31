/**
 * A presigned URL to upload a file to the external storage service.
 */
export interface PresignedUrlModel {
  url: string;
  fields: Record<string, string>;
}
