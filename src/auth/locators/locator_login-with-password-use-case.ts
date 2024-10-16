import type { Dependency } from "@/src/common/di/locator-types";
import { locator_common_CookieService } from "@/src/common/locators/locator_cookie-service";
import { locator_common_IpService } from "@/src/common/locators/locator_ip-service";
import { locator_rateLimits_RateLimitsRepository } from "@/src/rate-limits/locators/locator_rate-limits-repository";
import { LoginWithPasswordUseCase } from "../domain/use-cases/login-with-password-use-case";
import { locator_auth_AuthService } from "./locator_auth-service";

export const locator_auth_LoginWithPasswordUseCase: Dependency<
  LoginWithPasswordUseCase
> = () =>
  new LoginWithPasswordUseCase(
    locator_auth_AuthService(),
    locator_common_IpService(),
    locator_rateLimits_RateLimitsRepository(),
    locator_common_CookieService(),
  );
