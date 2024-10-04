import { locator } from "@/src/common/di/locator";
import type { Dependency } from "@/src/common/di/locator-types";
import { FileUploadServiceS3Impl } from "../data/services/file-upload-service-s3-impl";
import type { FileUploadService } from "../domain/interfaces/file-upload-service";

export const locator_fileUpload_FileUploadService: Dependency<
  FileUploadService
> = () => new FileUploadServiceS3Impl(locator.EnvService());
