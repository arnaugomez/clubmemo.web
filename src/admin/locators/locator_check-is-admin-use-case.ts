import { authLocator } from "@/src/auth/auth-locator";
import type { Dependency } from "@/src/common/di/locator-types";
import { CheckIsAdminUseCase } from "../domain/use-cases/check-is-admin-use-case";

export const locator_admin_CheckIsAdminUseCase: Dependency<
  CheckIsAdminUseCase
> = () => new CheckIsAdminUseCase(authLocator.GetSessionUseCase());
