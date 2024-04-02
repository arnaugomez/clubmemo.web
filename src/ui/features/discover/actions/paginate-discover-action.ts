"use server";

import { GetDiscoverCoursesInputModel } from "@/src/core/courses/domain/interfaces/courses-repository";
import { fetchDiscoverCourses } from "../fetch/fetch-discover-courses";

export async function paginateDiscoverAction(
  input: GetDiscoverCoursesInputModel,
) {
  // TODO: handle errors
  return await fetchDiscoverCourses(input);
}
