"use server";
import { ActionErrorHandler } from "@/src/common/ui/actions/action-error-handler";
import { ActionResponse } from "@/src/common/ui/models/server-form-errors";
import type { GetAdminResourcesUseCaseInputModel } from "../../domain/use-cases/get-admin-resources-use-case";
import { locator_admin_GetAdminResourcesUseCase } from "../../locators/locator_get-admin-resources-use-case";

export async function getAdminResourcesAction(
  input: GetAdminResourcesUseCaseInputModel,
) {
  try {
    const useCase = locator_admin_GetAdminResourcesUseCase();
    const result = await useCase.execute(input);
    return ActionResponse.formSuccess(result);
  } catch (e) {
    return ActionErrorHandler.handle(e);
  }
}
