import type { Dependency } from "@/src/common/di/locator-types";
import { locator_profile_GetMyProfileUseCase } from "@/src/profile/locators/locator_get-my-profile-use-case";
import { CreateCourseUseCase } from "../domain/use-cases/create-course-use-case";
import { locator_courses_CoursesRepository } from "./locator_courses-repository";

export const locator_courses_CreateCourseUseCase: Dependency<
  CreateCourseUseCase
> = () =>
  new CreateCourseUseCase(
    locator_profile_GetMyProfileUseCase(),
    locator_courses_CoursesRepository(),
  );
