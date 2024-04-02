import { PaginationModel } from "@/src/core/app/domain/models/pagination-model";
import { locator } from "@/src/core/app/locator";
import { EnrolledCourseListItemModel } from "@/src/core/courses/domain/models/enrolled-course-list-item-model";
import { cache } from "react";
import { fetchMyProfile } from "../../../profile/fetch/fetch-my-profile";

export interface FetchMyCoursesPaginationModel {
  page: number;
}

export const fetchMyCoursesPagination = cache(async function ({
  page,
}: FetchMyCoursesPaginationModel): Promise<
  PaginationModel<EnrolledCourseListItemModel>
> {
  const profile = await fetchMyProfile();
  if (!profile) return { results: [], count: 0 };
  const coursesRepository = await locator.CoursesRepository();
  return await coursesRepository.getMyCoursesPagination({
    profileId: profile.id,
    page,
  });
});
