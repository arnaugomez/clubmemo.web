"use server";

import { ActionErrorHandler } from "@/src/common/ui/actions/action-error-handler";
import { ActionResponse } from "@/src/common/ui/models/server-form-errors";
import type { PaginateNotesActionModel } from "../schemas/paginate-notes-action-model";
import { PaginateNotesActionSchema } from "../schemas/paginate-notes-action-model";
import { locator_notes_GetNotesUseCase } from "@/src/notes/locators/locator_get-notes-use-case";

export async function paginateNotesAction(input: PaginateNotesActionModel) {
  try {
    const parsed = PaginateNotesActionSchema.parse(input);
    const useCase = locator_notes_GetNotesUseCase();
    const response = await useCase.execute(parsed);
    return ActionResponse.formSuccess(response.toData((e) => e.data));
  } catch (e) {
    return ActionErrorHandler.handle(e);
  }
}
