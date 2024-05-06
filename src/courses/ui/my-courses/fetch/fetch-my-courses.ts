import { PaginationModel } from "@/src/common/domain/models/pagination-model";
import { locator } from "@/src/common/locator";
import type { EnrolledCourseListItemModel } from "@/src/courses/domain/models/enrolled-course-list-item-model";
import { cache } from "react";
import { fetchMyProfile } from "../../../../profile/ui/fetch/fetch-my-profile";

export interface FetchMyCoursesPaginationModel {
  page: number;
}

export const fetchMyCoursesPagination = cache(async function ({
  page,
}: FetchMyCoursesPaginationModel): Promise<
  PaginationModel<EnrolledCourseListItemModel>
> {
  const profile = await fetchMyProfile();
  if (!profile) return PaginationModel.empty();
  const coursesRepository = await locator.CoursesRepository();
  return await coursesRepository.getMyCoursesPagination({
    profileId: profile.id,
    page,
  });
});
