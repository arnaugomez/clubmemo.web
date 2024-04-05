"use server";

import { GetCoursesByAuthorInputModel } from "@/src/core/courses/domain/interfaces/courses-repository";
import { ActionResponse } from "@/src/ui/models/server-form-errors";
import { fetchCoursesByAuthor } from "../fetch/fetch-courses-by-author";

export async function paginateCoursesByAuthorAction(
  input: GetCoursesByAuthorInputModel,
) {
  try {
    const response = await fetchCoursesByAuthor(input);
    return ActionResponse.formSuccess(response);
  } catch (e) {
    // TODO: log error report
    console.error(e);
    return ActionResponse.formGlobalError("general");
  }
}
