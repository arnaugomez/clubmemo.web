import type { Dependency } from "@/src/common/di/locator-types";
import { GetAdminResourcesUseCase } from "../domain/use-cases/get-admin-resources-use-case";
import { locator_admin_CheckIsAdminUseCase } from "./locator_check-is-admin-use-case";
import { locator_common_DatabaseService } from "@/src/common/locators/locator_database-service";

export const locator_admin_GetAdminResourcesUseCase: Dependency<
  GetAdminResourcesUseCase
> = () =>
  new GetAdminResourcesUseCase(
    locator_common_DatabaseService(),
    locator_admin_CheckIsAdminUseCase(),
  );
