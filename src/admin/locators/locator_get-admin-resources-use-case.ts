import { locator } from "@/src/common/di/locator";
import type { Dependency } from "@/src/common/di/locator-types";
import { GetAdminResourcesUseCase } from "../domain/use-cases/get-admin-resources-use-case";
import { locator_admin_CheckIsAdminUseCase } from "./locator_check-is-admin-use-case";

export const locator_admin_GetAdminResourcesUseCase: Dependency<
  GetAdminResourcesUseCase
> = () =>
  new GetAdminResourcesUseCase(
    locator.DatabaseService(),
    locator_admin_CheckIsAdminUseCase(),
  );
