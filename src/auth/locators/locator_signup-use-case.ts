import type { Dependency } from "@/src/common/di/locator-types";
import { locator_common_CookieService } from "@/src/common/locators/locator_cookie-service";
import { locator_common_EmailService } from "@/src/common/locators/locator_email-service";
import { locator_common_IpService } from "@/src/common/locators/locator_ip-service";
import { locator_profiles_ProfilesRepository } from "@/src/profile/locators/locator_profiles-repository";
import { locator_rateLimits_RateLimitsRepository } from "@/src/rate-limits/locators/locator_rate-limits-repository";
import { SignupUseCase } from "../domain/use-cases/signup-use-case";
import { locator_auth_AuthService } from "./locator_auth-service";
import { locator_auth_EmailVerificationCodesRepository } from "./locator_email-verification-codes-repository";

export const locator_auth_SignupUseCase: Dependency<SignupUseCase> = () =>
  new SignupUseCase(
    locator_common_IpService(),
    locator_rateLimits_RateLimitsRepository(),
    locator_auth_AuthService(),
    locator_profiles_ProfilesRepository(),
    locator_auth_EmailVerificationCodesRepository(),
    locator_common_EmailService(),
    locator_common_CookieService(),
  );
