import type { Dependency } from "@/src/common/di/locator-types";
import { UpdateAdminResourceUseCase } from "../domain/use-cases/update-admin-resource-use-case";
import { locator_admin_CheckIsAdminUseCase } from "./locator_check-is-admin-use-case";
import { locator_common_DatabaseService } from "@/src/common/locators/locator_database-service";

export const locator_admin_UpdateAdminResourceUseCase: Dependency<
  UpdateAdminResourceUseCase
> = () =>
  new UpdateAdminResourceUseCase(
    locator_common_DatabaseService(),
    locator_admin_CheckIsAdminUseCase(),
  );
