import { locator } from "@/src/common/di/locator";
import type { Dependency } from "@/src/common/di/locator-types";
import { GetAdminResourceDetailUseCase } from "../domain/use-cases/get-admin-resource-detail-use-case";
import { locator_admin_CheckIsAdminUseCase } from "./locator_check-is-admin-use-case";

export const locator_admin_GetAdminResourceDetailUseCase: Dependency<
  GetAdminResourceDetailUseCase
> = () =>
  new GetAdminResourceDetailUseCase(
    locator.DatabaseService(),
    locator_admin_CheckIsAdminUseCase(),
  );
