"use server";
import { ActionErrorHandler } from "@/src/common/ui/actions/action-error-handler";
import { ActionResponse } from "@/src/common/ui/models/server-form-errors";
import type { CreateAdminResourceUseCaseInputModel } from "../../domain/use-cases/create-admin-resource-use-case";
import { locator_admin_CreateAdminResourceUseCase } from "../../locators/locator_create-admin-resource-use-case";

export async function createAdminResourceAction(
  input: CreateAdminResourceUseCaseInputModel,
) {
  try {
    const useCase = locator_admin_CreateAdminResourceUseCase();
    const result = await useCase.execute(input);
    return ActionResponse.formSuccess(result);
  } catch (e) {
    return ActionErrorHandler.handle(e);
  }
}
