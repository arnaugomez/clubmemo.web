"use server";
import { ActionErrorHandler } from "@/src/common/ui/actions/action-error-handler";
import { ActionResponse } from "@/src/common/ui/models/server-form-errors";
import type { UpdateAdminResourceUseCaseInputModel } from "../../domain/use-cases/update-admin-resource-use-case";
import { locator_admin_UpdateAdminResourceUseCase } from "../../locators/locator_update-admin-resource-use-case";
import { UpdateAdminResourceActionSchema } from "../schemas/update-admin-resource-action-schema";

/**
 * Server action for updating a resource in the admin panel. It receives the
 * data with the resource type, the id of the resource, and the new data to
 * update. It validates the input and then calls the use case.
 * @returns Does not return anything if the action is successful. It is recommended
 * to reload the data after a successful update.
 */
export async function updateAdminResourceAction(
  input: UpdateAdminResourceUseCaseInputModel,
) {
  try {
    const parsed = UpdateAdminResourceActionSchema.parse(input);
    const useCase = locator_admin_UpdateAdminResourceUseCase();
    await useCase.execute(parsed);
    return ActionResponse.formSuccess(null);
  } catch (e) {
    return ActionErrorHandler.handle(e);
  }
}
