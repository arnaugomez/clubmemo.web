import { locator_auth_GetSessionUseCase } from "@/src/auth/locators/locator_get-session-use-case";
import type { Dependency } from "@/src/common/di/locator-types";
import { CheckIsAdminUseCase } from "../domain/use-cases/check-is-admin-use-case";

export const locator_admin_CheckIsAdminUseCase: Dependency<
  CheckIsAdminUseCase
> = () => new CheckIsAdminUseCase(locator_auth_GetSessionUseCase());
