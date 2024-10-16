import type { Dependency } from "@/src/common/di/locator-types";
import { locator_common_DatabaseService } from "@/src/common/locators/locator_database-service";
import { CreateAdminResourceUseCase } from "../domain/use-cases/create-admin-resource-use-case";
import { locator_admin_CheckIsAdminUseCase } from "./locator_check-is-admin-use-case";

export const locator_admin_CreateAdminResourceUseCase: Dependency<
  CreateAdminResourceUseCase
> = () =>
  new CreateAdminResourceUseCase(
    locator_common_DatabaseService(),
    locator_admin_CheckIsAdminUseCase(),
  );
