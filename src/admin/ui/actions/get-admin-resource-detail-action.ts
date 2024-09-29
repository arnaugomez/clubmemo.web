"use server";
import { ActionErrorHandler } from "@/src/common/ui/actions/action-error-handler";
import { ActionResponse } from "@/src/common/ui/models/server-form-errors";
import type { GetAdminResourceDetailUseCaseInputModel } from "../../domain/use-cases/get-admin-resource-detail-use-case";
import { locator_admin_GetAdminResourceDetailUseCase } from "../../locators/locator_get-admin-resource-detail-use-case";

export async function getAdminResourceDetailAction(
  input: GetAdminResourceDetailUseCaseInputModel,
) {
  try {
    const useCase = locator_admin_GetAdminResourceDetailUseCase();
    const result = await useCase.execute(input);
    return ActionResponse.formSuccess(result);
  } catch (e) {
    return ActionErrorHandler.handle(e);
  }
}
