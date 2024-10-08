import { authLocator } from "@/src/auth/auth-locator";
import { locator } from "@/src/common/di/locator";
import type { Dependency } from "@/src/common/di/locator-types";
import { UploadFileUseCase } from "../domain/use-cases/upload-file-use-case";
import { locator_fileUpload_FileUploadsRepository } from "./locator_file-uploads-repository";

export const locator_fileUpload_UploadFileUseCase: Dependency<
  UploadFileUseCase
> = () =>
  new UploadFileUseCase(
    authLocator.GetSessionUseCase(),
    locator.RateLimitsRepository(),
    locator_fileUpload_FileUploadsRepository(),
  );
