import type { Dependency } from "@/src/common/di/locator-types";
import { singleton } from "@/src/common/di/locator-utils";
import { locator_common_EnvService } from "@/src/common/locators/locator_env-service";
import { FileUploadServiceS3Impl } from "../data/services/file-upload-service-s3-impl";
import type { FileUploadService } from "../domain/interfaces/file-upload-service";

export const locator_fileUpload_FileUploadService: Dependency<FileUploadService> =
  singleton(() => new FileUploadServiceS3Impl(locator_common_EnvService()));
