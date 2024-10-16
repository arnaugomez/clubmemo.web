import type { Dependency } from "@/src/common/di/locator-types";
import { locator_rateLimits_RateLimitsRepository } from "@/src/rate-limits/locators/locator_rate-limits-repository";
import { UploadFileUseCase } from "../domain/use-cases/upload-file-use-case";
import { locator_fileUpload_FileUploadsRepository } from "./locator_file-uploads-repository";
import { locator_auth_GetSessionUseCase } from "@/src/auth/locators/locator_get-session-use-case";

export const locator_fileUpload_UploadFileUseCase: Dependency<
  UploadFileUseCase
> = () =>
  new UploadFileUseCase(
    locator_auth_GetSessionUseCase(),
    locator_rateLimits_RateLimitsRepository(),
    locator_fileUpload_FileUploadsRepository(),
  );
