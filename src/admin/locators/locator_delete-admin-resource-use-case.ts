import type { Dependency } from "@/src/common/di/locator-types";
import { DeleteAdminResourceUseCase } from "../domain/use-cases/delete-admin-resource-use-case";
import { locator_admin_CheckIsAdminUseCase } from "./locator_check-is-admin-use-case";
import { locator_common_DatabaseService } from "@/src/common/locators/locator_database-service";

export const locator_admin_DeleteAdminResourceUseCase: Dependency<
  DeleteAdminResourceUseCase
> = () =>
  new DeleteAdminResourceUseCase(
    locator_common_DatabaseService(),
    locator_admin_CheckIsAdminUseCase(),
  );
