import { locator } from "@/src/common/di/locator";
import type { Dependency } from "@/src/common/di/locator-types";
import { DeleteAdminResourceUseCase } from "../domain/use-cases/delete-admin-resource-use-case";
import { locator_admin_CheckIsAdminUseCase } from "./locator_check-is-admin-use-case";

export const locator_admin_DeleteAdminResourceUseCase: Dependency<
  DeleteAdminResourceUseCase
> = () =>
  new DeleteAdminResourceUseCase(
    locator.DatabaseService(),
    locator_admin_CheckIsAdminUseCase(),
  );
