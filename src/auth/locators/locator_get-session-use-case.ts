import type { Dependency } from "@/src/common/di/locator-types";
import { locator_common_CookieService } from "@/src/common/locators/locator_cookie-service";
import { GetSessionUseCase } from "../domain/use-cases/get-session-use-case";
import { locator_auth_AuthService } from "./locator_auth-service";

export const locator_auth_GetSessionUseCase: Dependency<
  GetSessionUseCase
> = () =>
  new GetSessionUseCase(
    locator_auth_AuthService(),
    locator_common_CookieService(),
  );
