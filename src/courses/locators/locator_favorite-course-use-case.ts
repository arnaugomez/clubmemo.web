import type { Dependency } from "@/src/common/di/locator-types";
import { locator_profile_GetMyProfileUseCase } from "@/src/profile/locators/locator_get-my-profile-use-case";
import { FavoriteCourseUseCase } from "../domain/use-cases/favorite-course-use-case";
import { locator_courses_CourseEnrollmentsRepository } from "./locator_course-enrollments-repository";

export const locator_courses_FavoriteCourseUseCase: Dependency<
  FavoriteCourseUseCase
> = () =>
  new FavoriteCourseUseCase(
    locator_profile_GetMyProfileUseCase(),
    locator_courses_CourseEnrollmentsRepository(),
  );
