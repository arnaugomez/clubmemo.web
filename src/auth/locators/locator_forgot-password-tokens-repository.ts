import type { Dependency } from "@/src/common/di/locator-types";
import { locator_common_DatabaseService } from "@/src/common/locators/locator_database-service";
import { ForgotPasswordTokensRepositoryImpl } from "../data/repositories/forgot-password-tokens-repository-impl";
import type { ForgotPasswordTokensRepository } from "../domain/interfaces/forgot-password-tokens-repository";

export const locator_auth_ForgotPasswordTokensRepository: Dependency<
  ForgotPasswordTokensRepository
> = () =>
  new ForgotPasswordTokensRepositoryImpl(locator_common_DatabaseService());
