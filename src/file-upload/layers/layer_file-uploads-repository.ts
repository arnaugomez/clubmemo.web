import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import { DatabaseService } from "@/src/common/layers/layer_database-service";
import { FileUploadService } from "@/src/file-upload/layers/layer_file-upload-service";
import { FileUploadsRepositoryImpl } from "../data/repositories/file-uploads-repository-impl";
import { FileUploadsRepository } from "../domain/interfaces/file-uploads-repository";

export { FileUploadsRepository };
export const FileUploadsRepositoryLive = Layer.effect(
  FileUploadsRepository,
  Effect.gen(function* () {
    return new FileUploadsRepositoryImpl(
      yield* FileUploadService,
      yield* DatabaseService,
    );
  }),
);
