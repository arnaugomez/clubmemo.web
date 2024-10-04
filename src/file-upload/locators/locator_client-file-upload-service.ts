import type { Dependency } from "@/src/common/di/locator-types";
import { ClientFileUploadServiceS3Impl } from "../data/services/client-file-upload-service-s3-impl";
import type { ClientFileUploadService } from "../domain/interfaces/client-file-upload-service";

export const locator_fileUpload_ClientFileUploadService: Dependency<
  ClientFileUploadService
> = () => new ClientFileUploadServiceS3Impl();
