"use server";
import { ActionErrorHandler } from "@/src/common/ui/actions/action-error-handler";
import { ActionResponse } from "@/src/common/ui/models/server-form-errors";
import type { GetAdminResourcesUseCaseInputModel } from "../../domain/use-cases/get-admin-resources-use-case";
import { locator_admin_GetAdminResourcesUseCase } from "../../locators/locator_get-admin-resources-use-case";
import { GetAdminResourcesActionSchema } from "../schemas/get-admin-resources-action-schema";

export async function getAdminResourcesAction(
  input: GetAdminResourcesUseCaseInputModel,
) {
  try {
    const parsed = GetAdminResourcesActionSchema.parse(input);
    const useCase = locator_admin_GetAdminResourcesUseCase();
    const result = await useCase.execute(parsed);
    return ActionResponse.formSuccess(
      result.toData((resourceData) => resourceData),
    );
  } catch (e) {
    return ActionErrorHandler.handle(e);
  }
}
