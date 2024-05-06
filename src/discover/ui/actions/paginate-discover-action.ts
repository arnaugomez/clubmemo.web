"use server";

import { ActionResponse } from "@/src/common/ui/models/server-form-errors";
import type { GetDiscoverCoursesInputModel } from "@/src/courses/domain/interfaces/courses-repository";
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
