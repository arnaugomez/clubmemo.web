import { randomUUID } from "node:crypto";
import * as DateTime from "effect/DateTime";
import * as Effect from "effect/Effect";
import * as Stream from "effect/Stream";
import { ObjectId } from "mongodb";
import type { DatabaseService } from "@/src/common/domain/interfaces/database-service";
import { ExternalServiceError } from "@/src/common/effect/errors";
import type { FileUploadService } from "../../domain/interfaces/file-upload-service";
import type {
  CreateFileUploadInputModel,
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
  }

  create = Effect.fn("FileUploadsRepositoryImpl.create")(function* (
    this: FileUploadsRepositoryImpl,
    { collection, contentType, field, userId }: CreateFileUploadInputModel,
  ) {
    const key = `${collection}/${field}/${randomUUID()}`;
    const presignedUrl = yield* this.fileUploadService.generatePresignedUrl({
      key,
      contentType,
    });

    const url = presignedUrl.url + presignedUrl.fields.key;
    const createdAt = yield* DateTime.nowAsDate;
    yield* Effect.tryPromise({
      try: () =>
        this.fileUploads.insertOne({
          collection,
          field,
          url,
          key,
          contentType,
          createdByUserId: new ObjectId(userId),
          createdAt,
        }),
      catch: (cause) =>
        new ExternalServiceError({
          operation: "FileUploadsRepositoryImpl.create",
          cause,
        }),
    });

    return { presignedUrl, url };
  }).bind(this);

  deleteOutdated = Effect.fn("FileUploadsRepositoryImpl.deleteOutdated")(
    function* (this: FileUploadsRepositoryImpl) {
      const now = yield* DateTime.nowAsDate;
      const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      const cursor = yield* Effect.acquireRelease(
        Effect.sync(() => this.fileUploads.find({ date: { $lt: oneDayAgo } })),
        (cursor) => Effect.promise(() => cursor.close()),
      );
      const db = this.databaseService.client.db();
      const service = this;
      yield* Stream.fromAsyncIterable(
        cursor,
        (cause) =>
          new ExternalServiceError({
            operation: "FileUploads.readOutdated",
            cause,
          }),
      ).pipe(
        Stream.runForEach((item) =>
          Effect.gen(function* () {
            const { collection, field, url, key, _id } = item;
            if (!collection || !field) return;
            const reference = yield* Effect.tryPromise({
              try: () => db.collection(collection).findOne({ [field]: url }),
              catch: (cause) =>
                new ExternalServiceError({
                  operation: "FileUploads.findReference",
                  cause,
                }),
            });
            if (reference) return;
            yield* service.fileUploadService.deleteFile(key);
            yield* Effect.tryPromise({
              try: () => service.fileUploads.deleteOne({ _id }),
              catch: (cause) =>
                new ExternalServiceError({
                  operation: "FileUploads.deleteRecord",
                  cause,
                }),
            });
          }),
        ),
      );
    },
    Effect.scoped,
  ).bind(this);
}
