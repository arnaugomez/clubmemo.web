import type { Dependency } from "@/src/common/di/locator-types";
import { locator_common_CookieService } from "@/src/common/locators/locator_cookie-service";
import { LogoutUseCase } from "../domain/use-cases/logout-use-case";
import { locator_auth_AuthService } from "./locator_auth-service";
import { locator_auth_GetSessionUseCase } from "./locator_get-session-use-case";

export const locator_auth_LogoutUseCase: Dependency<LogoutUseCase> = () =>
  new LogoutUseCase(
    locator_auth_GetSessionUseCase(),
    locator_auth_AuthService(),
    locator_common_CookieService(),
  );
