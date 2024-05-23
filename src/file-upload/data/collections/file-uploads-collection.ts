import { collection } from "@/src/common/data/utils/mongo";

export interface FileUploadsCollection {
  key: string;
  keyPrefix: string;
  count: number;
  url: string;
  isCurrent: boolean;
  createdAt: Date;
}

export const fileUploadsCollection =
  collection<FileUploadsCollection>("fileUploads");
