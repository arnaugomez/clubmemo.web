import { authLocator } from "@/src/auth/auth-locator";
import type { Dependency } from "@/src/common/di/locator-types";
import { UploadFileUseCase } from "../domain/use-cases/upload-file-use-case";
import { locator_fileUpload_FileUploadsRepository } from "./locator_file-uploads-repository";
import { locator_rateLimits_RateLimitsRepository } from "@/src/rate-limits/locators/locator_rate-limits-repository";

export const locator_fileUpload_UploadFileUseCase: Dependency<
  UploadFileUseCase
> = () =>
  new UploadFileUseCase(
    authLocator.GetSessionUseCase(),
    locator_rateLimits_RateLimitsRepository(),
    locator_fileUpload_FileUploadsRepository(),
  );
