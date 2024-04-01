import { cache } from "react";

import { EnrolledCourseListItemModel } from "@/src/core/courses/domain/models/enrolled-course-list-item-model";
import { fetchMyProfile } from "../../../profile/fetch/fetch-my-profile";
import { locator } from "@/src/core/app/locator";

export const fetchMyCourses = cache(
  async (): Promise<EnrolledCourseListItemModel[]> => {
    const profile = await fetchMyProfile();
    if (!profile) return [];

    const coursesRepository = await locator.CoursesRepository();
    return await coursesRepository.getEnrolledCourses({
      profileId: profile?.id,
    });
  },
);
