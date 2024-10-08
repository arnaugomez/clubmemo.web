import { locator } from "@/src/common/di/locator";
import type { Dependency } from "@/src/common/di/locator-types";
import { UpdateAdminResourceUseCase } from "../domain/use-cases/update-admin-resource-use-case";
import { locator_admin_CheckIsAdminUseCase } from "./locator_check-is-admin-use-case";

export const locator_admin_UpdateAdminResourceUseCase: Dependency<
  UpdateAdminResourceUseCase
> = () =>
  new UpdateAdminResourceUseCase(
    locator.DatabaseService(),
    locator_admin_CheckIsAdminUseCase(),
  );
