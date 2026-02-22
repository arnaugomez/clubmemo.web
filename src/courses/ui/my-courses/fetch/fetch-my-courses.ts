import { cache } from "react";
import { PaginationModel } from "@/src/common/domain/models/pagination-model";
import type { EnrolledCourseListItemModel } from "@/src/courses/domain/models/enrolled-course-list-item-model";
import { locator_courses_CoursesRepository } from "@/src/courses/locators/locator_courses-repository";
import { fetchMyProfile } from "../../../../profile/ui/fetch/fetch-my-profile";

export interface FetchMyCoursesPaginationModel {
  page: number;
}

export const fetchMyCoursesPagination = cache(
  async ({
    page,
  }: FetchMyCoursesPaginationModel): Promise<
    PaginationModel<EnrolledCourseListItemModel>
  > => {
    const profile = await fetchMyProfile();
    if (!profile) return PaginationModel.empty();
    const coursesRepository = locator_courses_CoursesRepository();
    return await coursesRepository.getMyCoursesPagination({
      profileId: profile.id,
      page,
    });
  },
);
