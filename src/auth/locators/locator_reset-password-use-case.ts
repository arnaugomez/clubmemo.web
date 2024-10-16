import type { Dependency } from "@/src/common/di/locator-types";
import { locator_common_IpService } from "@/src/common/locators/locator_ip-service";
import { locator_rateLimits_RateLimitsRepository } from "@/src/rate-limits/locators/locator_rate-limits-repository";
import { ResetPasswordUseCase } from "../domain/use-cases/reset-password-use-case";
import { locator_auth_AuthService } from "./locator_auth-service";
import { locator_auth_ForgotPasswordTokensRepository } from "./locator_forgot-password-tokens-repository";
import { locator_auth_UsersRepository } from "./locator_users-repository";

export const locator_auth_ResetPasswordUseCase: Dependency<
  ResetPasswordUseCase
> = () =>
  new ResetPasswordUseCase(
    locator_common_IpService(),
    locator_rateLimits_RateLimitsRepository(),
    locator_auth_UsersRepository(),
    locator_auth_AuthService(),
    locator_auth_ForgotPasswordTokensRepository(),
  );
