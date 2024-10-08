import { locator } from "@/src/common/di/locator";
import type { Dependency } from "@/src/common/di/locator-types";
import { FileUploadsRepositoryImpl } from "../data/repositories/file-uploads-repository-impl";
import type { FileUploadsRepository } from "../domain/interfaces/file-uploads-repository";
import { locator_fileUpload_FileUploadService } from "./locator_file-upload-service";

export const locator_fileUpload_FileUploadsRepository: Dependency<
  FileUploadsRepository
> = () =>
  new FileUploadsRepositoryImpl(
    locator_fileUpload_FileUploadService(),
    locator.DatabaseService(),
  );
