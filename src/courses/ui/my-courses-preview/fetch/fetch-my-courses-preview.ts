import { cache } from "react";

import type { EnrolledCourseListItemModel } from "@/src/courses/domain/models/enrolled-course-list-item-model";
import { fetchMyProfile } from "../../../../profile/ui/fetch/fetch-my-profile";
import { locator_courses_CoursesRepository } from "@/src/courses/locators/locator_courses-repository";

export const fetchMyCoursesPreview = cache(
  async (): Promise<EnrolledCourseListItemModel[]> => {
    const profile = await fetchMyProfile();
    if (!profile) return [];

    const coursesRepository = locator_courses_CoursesRepository();
    return await coursesRepository.getMyCourses({
      profileId: profile?.id,
    });
  },
);
