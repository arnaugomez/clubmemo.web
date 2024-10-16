import type { Dependency } from "@/src/common/di/locator-types";
import { locator_profile_GetMyProfileUseCase } from "@/src/profile/locators/locator_get-my-profile-use-case";
import { locator_tags_TagsRepository } from "@/src/tags/locators/locator_tags-repository";
import { EditCourseUseCase } from "../domain/use-cases/edit-course-use-case";
import { locator_courses_CoursesRepository } from "./locator_courses-repository";

export const locator_courses_EditCourseUseCase: Dependency<
  EditCourseUseCase
> = () =>
  new EditCourseUseCase(
    locator_profile_GetMyProfileUseCase(),
    locator_tags_TagsRepository(),
    locator_courses_CoursesRepository(),
  );
