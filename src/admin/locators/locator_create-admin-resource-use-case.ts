import { locator } from "@/src/common/di/locator";
import type { Dependency } from "@/src/common/di/locator-types";
import { CreateAdminResourceUseCase } from "../domain/use-cases/create-admin-resource-use-case";
import { locator_admin_CheckIsAdminUseCase } from "./locator_check-is-admin-use-case";

export const locator_admin_CreateAdminResourceUseCase: Dependency<
  CreateAdminResourceUseCase
> = () =>
  new CreateAdminResourceUseCase(
    locator.DatabaseService(),
    locator_admin_CheckIsAdminUseCase(),
  );
