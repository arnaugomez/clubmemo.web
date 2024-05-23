import type { MongoService } from "@/src/common/domain/interfaces/mongo-service";
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
    mongoService: MongoService,
  ) {
    this.fileUploads = mongoService.collection(fileUploadsCollection);
  }

  async create(
    input: CreateFileUploadInputModel,
  ): Promise<CreateFileUploadOutputModel> {
    const previous = await this.fileUploads
      .find(
        { keyPrefix: input.keyPrefix },
        {
          sort: { createdAt: -1 },
          limit: 1,
        },
      )
      .next();
    const count = previous ? (previous.count + 1) % 1000 : 0;
    const keySuffix = count ? `${input.fileName}-${count}` : "";
    const key = `${input.keyPrefix}/${keySuffix}`;

    const presignedUrl = await this.fileUploadService.generatePresignedUrl({
      key,
      contentType: input.contentType,
    });

    await this.fileUploads.deleteMany({ keyPrefix: input.keyPrefix });
    const url = presignedUrl.url + presignedUrl.fields.key;
    await this.fileUploads.insertOne({
      key,
      keyPrefix: input.keyPrefix,
      count,
      url,
      isCurrent: false,
      createdAt: new Date(),
    });

    return { presignedUrl, url };
  }

  async setCurrent(url: string): Promise<void> {
    const urlObject = new URL(url);
    const key = urlObject.pathname;
    const keyPrefix = key.split("/").slice(0, -1).join("/");
    this.fileUploads.updateMany({ keyPrefix }, { $set: { isCurrent: false } });
    this.fileUploads.updateOne({ key }, { $set: { isCurrent: true } });
  }

  async deleteOutdated(): Promise<void> {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const cursor = this.fileUploads.find({
      isCurrent: false,
      date: { $lt: oneDayAgo },
    });

    for await (const item of cursor) {
      const { key } = item;
      await this.fileUploadService.deleteFile(key);
      await this.fileUploads.deleteOne({ key });
    }
  }
}
