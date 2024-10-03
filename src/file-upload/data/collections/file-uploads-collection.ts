import { collection } from "@/src/common/data/utils/mongo";
import type { ObjectId } from "mongodb";
import type {
  FileUploadCollectionModel,
  FileUploadFieldModel,
} from "../../domain/models/file-upload-field-model";

export interface FileUploadDoc {
  collection: FileUploadCollectionModel;
  field: FileUploadFieldModel;
  key: string;
  url: string;
  contentType: string;
  createdByUserId: ObjectId;
  createdAt: Date;
}

/**
 * Collection of MongoDB documents of type `FileUploadDoc`
 */
export const fileUploadsCollection = collection<FileUploadDoc>("fileUploads");
