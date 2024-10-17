import type { Dependency } from "@/src/common/di/locator-types";
import { locator_common_CookieService } from "@/src/common/locators/locator_cookie-service";
import { locator_rateLimits_RateLimitsRepository } from "@/src/rate-limits/locators/locator_rate-limits-repository";
import { VerifyEmailUseCase } from "../domain/use-cases/verify-email-use-case";
import { locator_auth_AuthService } from "./locator_auth-service";
import { locator_auth_EmailVerificationCodesRepository } from "./locator_email-verification-codes-repository";
import { locator_auth_GetSessionUseCase } from "./locator_get-session-use-case";

export const locator_auth_VerifyEmailUseCase: Dependency<
  VerifyEmailUseCase
> = () =>
  new VerifyEmailUseCase(
    locator_auth_GetSessionUseCase(),
    locator_auth_EmailVerificationCodesRepository(),
    locator_auth_AuthService(),
    locator_rateLimits_RateLimitsRepository(),
    locator_common_CookieService(),
  );