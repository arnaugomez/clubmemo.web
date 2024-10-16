import type { Dependency } from "@/src/common/di/locator-types";
import { locator_profile_GetMyProfileUseCase } from "@/src/profile/locators/locator_get-my-profile-use-case";
import { EditCourseConfigUseCase } from "../domain/use-cases/edit-course-config-use-case";
import { locator_courses_CourseEnrollmentsRepository } from "./locator_course-enrollments-repository";

export const locator_courses_EditCourseConfigUseCase: Dependency<
  EditCourseConfigUseCase
> = () =>
  new EditCourseConfigUseCase(
    locator_profile_GetMyProfileUseCase(),
    locator_courses_CourseEnrollmentsRepository(),
  );
