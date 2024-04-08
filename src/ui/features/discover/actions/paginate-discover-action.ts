"use server";

import { GetDiscoverCoursesInputModel } from "@/src/core/courses/domain/interfaces/courses-repository";
import { ActionResponse } from "@/src/ui/models/server-form-errors";
import { fetchDiscoverCourses } from "../fetch/fetch-discover-courses";

export async function paginateDiscoverAction(
  input: GetDiscoverCoursesInputModel,
) {
  try {
    const response = await fetchDiscoverCourses(input);
    return ActionResponse.formSuccess(response);
  } catch (e) {
    // TODO: log error report
    console.error(e);
    return ActionResponse.formGlobalError("general");
  }
}
