import type { DatabaseService } from "@/src/common/domain/interfaces/database-service";
import { randomUUID } from "crypto";
import { ObjectId } from "mongodb";
import type { FileUploadService } from "../../domain/interfaces/file-upload-service";
import type {
  CreateFileUploadInputModel,
  CreateFileUploadOutputModel,
  FileUploadsRepository,
} from "../../domain/interfaces/file-uploads-repository";
import { fileUploadsCollection } from "../collections/file-uploads-collection";

export class FileUploadsRepositoryImpl implements FileUploadsRepository {
  private readonly fileUploads: typeof fileUploadsCollection.type;

  constructor(
    private readonly fileUploadService: FileUploadService,
    private readonly databaseService: DatabaseService,
  ) {
    this.fileUploads = databaseService.collection(fileUploadsCollection);
    this.fileUploads.createIndex({ keyPrefix: 1 });
    this.fileUploads.createIndex({ key: 1 });
  }

  async create({
    collection,
    contentType,
    field,
    userId,
  }: CreateFileUploadInputModel): Promise<CreateFileUploadOutputModel> {
    const key = `${collection}/${field}/${randomUUID()}`;
    const presignedUrl = await this.fileUploadService.generatePresignedUrl({
      key,
      contentType,
    });

    const url = presignedUrl.url + presignedUrl.fields.key;
    await this.fileUploads.insertOne({
      collection,
      field,
      url,
      key,
      contentType,
      createdByUserId: new ObjectId(userId),
      createdAt: new Date(),
    });

    return { presignedUrl, url };
  }

  async deleteOutdated(): Promise<void> {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const cursor = this.fileUploads.find({
      date: { $lt: oneDayAgo },
    });
    const db = this.databaseService.client.db();

    for await (const item of cursor) {
      const { collection, field, url, key, _id } = item;
      const count = db.collection(collection).countDocuments({ [field]: url });
      if (!count) {
        await this.fileUploadService.deleteFile(key);
        await this.fileUploads.deleteOne({ _id });
      }
    }
  }
}
