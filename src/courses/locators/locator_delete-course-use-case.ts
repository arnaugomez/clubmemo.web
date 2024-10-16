import type { Dependency } from "@/src/common/di/locator-types";
import { locator_notes_NotesRepository } from "@/src/notes/locators/locator_notes-repository";
import { locator_profile_GetMyProfileUseCase } from "@/src/profile/locators/locator_get-my-profile-use-case";
import { DeleteCourseUseCase } from "../domain/use-cases/delete-course-use-case";
import { locator_courses_CourseEnrollmentsRepository } from "./locator_course-enrollments-repository";
import { locator_courses_CoursePermissionsRepository } from "./locator_course-permissions-repository";
import { locator_courses_CoursesRepository } from "./locator_courses-repository";

export const locator_courses_DeleteCourseUseCase: Dependency<
  DeleteCourseUseCase
> = () =>
  new DeleteCourseUseCase(
    locator_profile_GetMyProfileUseCase(),
    locator_courses_CoursesRepository(),
    locator_courses_CourseEnrollmentsRepository(),
    locator_courses_CoursePermissionsRepository(),
    locator_notes_NotesRepository(),
  );
