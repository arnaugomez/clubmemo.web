"use server";

import { ActionErrorHandler } from "@/src/common/ui/actions/action-error-handler";
import { ActionResponse } from "@/src/common/ui/models/server-form-errors";
import { fetchCourseNotes } from "../fetch/fetch-course-notes";
import type { PaginateNotesActionModel } from "../schemas/paginate-notes-action-model";
import { PaginateNotesActionSchema } from "../schemas/paginate-notes-action-model";

export async function paginateNotesAction(input: PaginateNotesActionModel) {
  try {
    const parsed = PaginateNotesActionSchema.parse(input);
    const response = await fetchCourseNotes(parsed);
    return ActionResponse.formSuccess(response.toData((e) => e.data));
  } catch (e) {
    return ActionErrorHandler.handle(e);
  }
}
