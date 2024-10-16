import type { Dependency } from "@/src/common/di/locator-types";
import { locator_common_DatabaseService } from "@/src/common/locators/locator_database-service";
import { EmailVerificationCodesRepositoryImpl } from "../data/repositories/email-verification-codes-repository-impl";
import type { EmailVerificationCodesRepository } from "../domain/interfaces/email-verification-codes-repository";

export const locator_auth_EmailVerificationCodesRepository: Dependency<
  EmailVerificationCodesRepository
> = () =>
  new EmailVerificationCodesRepositoryImpl(locator_common_DatabaseService());
