import type { Dependency } from "@/src/common/di/locator-types";
import { locator_notes_NotesRepository } from "@/src/notes/locators/locator_notes-repository";
import { locator_profile_GetMyProfileUseCase } from "@/src/profile/locators/locator_get-my-profile-use-case";
import { CopyCourseUseCase } from "../domain/use-cases/copy-course-use-case";
import { locator_courses_CoursesRepository } from "./locator_courses-repository";

export const locator_courses_CopyCourseUseCase: Dependency<
  CopyCourseUseCase
> = () =>
  new CopyCourseUseCase(
    locator_courses_CoursesRepository(),
    locator_notes_NotesRepository(),
    locator_profile_GetMyProfileUseCase(),
  );
