import { collection } from "@/src/common/data/utils/mongo";

export interface FileUploadDoc {
  key: string;
  keyPrefix: string;
  count: number;
  url: string;
  isCurrent: boolean;
  createdAt: Date;
}

/**
 * Collection of MongoDB documents of type `FileUploadDoc`
 */
export const fileUploadsCollection = collection<FileUploadDoc>("fileUploads");
