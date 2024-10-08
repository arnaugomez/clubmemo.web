"use server";
import { ActionErrorHandler } from "@/src/common/ui/actions/action-error-handler";
import { ActionResponse } from "@/src/common/ui/models/server-form-errors";
import { AdminResourceTypeModel } from "../../domain/models/admin-resource-model";
import type { DeleteAdminResourceUseCaseInputModel } from "../../domain/use-cases/delete-admin-resource-use-case";
import { locator_admin_DeleteAdminResourceUseCase } from "../../locators/locator_delete-admin-resource-use-case";
import {
  DeleteAdminResourceActionSchema,
  DeleteAdminResourceActionSchemaForSessions,
} from "../schemas/delete-admin-resource-action-schema";

export async function deleteAdminResourceAction(
  input: DeleteAdminResourceUseCaseInputModel,
) {
  try {
    const parsed = (
      input.resourceType === AdminResourceTypeModel.sessions
        ? DeleteAdminResourceActionSchemaForSessions
        : DeleteAdminResourceActionSchema
    ).parse(input);
    const useCase = locator_admin_DeleteAdminResourceUseCase();
    await useCase.execute(parsed);
    return ActionResponse.formSuccess(null);
  } catch (e) {
    return ActionErrorHandler.handle(e);
  }
}
