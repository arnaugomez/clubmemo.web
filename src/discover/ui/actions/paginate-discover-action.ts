"use server";

import { ActionErrorHandler } from "@/src/common/ui/actions/action-error-handler";
import { ActionResponse } from "@/src/common/ui/models/server-form-errors";
import { fetchDiscoverCourses } from "../fetch/fetch-discover-courses";
import type { PaginateDiscoverActionModel } from "../schemas/paginate-discover-action-schema";
import { PaginateDiscoverActionSchema } from "../schemas/paginate-discover-action-schema";

export async function paginateDiscoverAction(
  input: PaginateDiscoverActionModel,
) {
  try {
    const parsed = PaginateDiscoverActionSchema.parse(input);
    const response = await fetchDiscoverCourses(parsed);
    return ActionResponse.formSuccess(response);
  } catch (e) {
    return ActionErrorHandler.handle(e);
  }
}
