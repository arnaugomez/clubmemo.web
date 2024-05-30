"use server";

import { ActionErrorHandler } from "@/src/common/ui/actions/action-error-handler";
import { ActionResponse } from "@/src/common/ui/models/server-form-errors";
import { fetchCoursesByAuthor } from "../fetch/fetch-courses-by-author";
import type { PaginateCoursesByAuthorActionModel } from "../schemas/paginate-courses-by-author-action-schema";
import { PaginateCoursesByAuthorActionSchema } from "../schemas/paginate-courses-by-author-action-schema";

export async function paginateCoursesByAuthorAction(
  input: PaginateCoursesByAuthorActionModel,
) {
  try {
    const parsed = PaginateCoursesByAuthorActionSchema.parse(input);
    const response = await fetchCoursesByAuthor(parsed);
    return ActionResponse.formSuccess(response);
  } catch (e) {
    return ActionErrorHandler.handle(e);
  }
}
