"use server";
import { ActionErrorHandler } from "@/src/common/ui/actions/action-error-handler";
import { ActionResponse } from "@/src/common/ui/models/server-form-errors";
import type { CreateAdminResourceUseCaseInputModel } from "../../domain/use-cases/create-admin-resource-use-case";
import { locator_admin_CreateAdminResourceUseCase } from "../../locators/locator_create-admin-resource-use-case";
import { CreateAdminResourceActionSchema } from "../schemas/create-admin-resource-action-schema";

export async function createAdminResourceAction(
  input: CreateAdminResourceUseCaseInputModel,
) {
  try {
    const parsed = CreateAdminResourceActionSchema.parse(input);
    const useCase = locator_admin_CreateAdminResourceUseCase();
    const result = await useCase.execute(parsed);
    return ActionResponse.formSuccess(result);
  } catch (e) {
    return ActionErrorHandler.handle(e);
  }
}
