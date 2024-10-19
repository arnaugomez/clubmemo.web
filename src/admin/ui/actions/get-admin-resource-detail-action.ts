"use server";
import { ActionErrorHandler } from "@/src/common/ui/actions/action-error-handler";
import { ActionResponse } from "@/src/common/ui/models/server-form-errors";
import type { GetAdminResourceDetailUseCaseInputModel } from "../../domain/use-cases/get-admin-resource-detail-use-case";
import { locator_admin_GetAdminResourceDetailUseCase } from "../../locators/locator_get-admin-resource-detail-use-case";
import { GetAdminResourceDetailActionSchema } from "../schemas/get-admin-resource-detail-action-schema";

/**
 * Server action to retrieve a resource from the admin panel. It receives the
 * data with the resource type and the id of the resource.
 */
export async function getAdminResourceDetailAction(
  input: GetAdminResourceDetailUseCaseInputModel,
) {
  try {
    const parsed = GetAdminResourceDetailActionSchema.parse(input);
    const useCase = locator_admin_GetAdminResourceDetailUseCase();
    const result = await useCase.execute(parsed);
    return ActionResponse.formSuccess(result);
  } catch (e) {
    return ActionErrorHandler.handle(e);
  }
}
