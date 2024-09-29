"use server";
import { ActionErrorHandler } from "@/src/common/ui/actions/action-error-handler";
import { ActionResponse } from "@/src/common/ui/models/server-form-errors";
import type { UpdateAdminResourceUseCaseInputModel } from "../../domain/use-cases/update-admin-resource-use-case";
import { locator_admin_UpdateAdminResourceUseCase } from "../../locators/locator_update-admin-resource-use-case";

export async function updateAdminResourceAction(
  input: UpdateAdminResourceUseCaseInputModel,
) {
  try {
    const useCase = locator_admin_UpdateAdminResourceUseCase();
    await useCase.execute(input);
    return ActionResponse.formSuccess();
  } catch (e) {
    return ActionErrorHandler.handle(e);
  }
}
