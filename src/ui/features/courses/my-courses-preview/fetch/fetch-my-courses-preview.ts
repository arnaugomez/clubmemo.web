import { cache } from "react";

import { locator } from "@/src/core/common/locator";
import { EnrolledCourseListItemModel } from "@/src/core/courses/domain/models/enrolled-course-list-item-model";
import { fetchMyProfile } from "../../../profile/fetch/fetch-my-profile";

export const fetchMyCoursesPreview = cache(
  async (): Promise<EnrolledCourseListItemModel[]> => {
    const profile = await fetchMyProfile();
    if (!profile) return [];

    const coursesRepository = await locator.CoursesRepository();
    return await coursesRepository.getMyCourses({
      profileId: profile?.id,
    });
  },
);
