"use server";
import { ActionErrorHandler } from "@/src/common/ui/actions/action-error-handler";
import { ActionResponse } from "@/src/common/ui/models/server-form-errors";
import type { GetAdminResourcesUseCaseInputModel } from "../../domain/use-cases/get-admin-resources-use-case";
import { locator_admin_GetAdminResourcesUseCase } from "../../locators/locator_get-admin-resources-use-case";
import { GetAdminResourcesActionSchema } from "../schemas/get-admin-resources-action-schema";

/**
 * Server action to retrieve a paginated list of resources from the admin panel.
 * It takes as parameters the resource type, the page number, the search filters
 * and the sort order.
 */
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
