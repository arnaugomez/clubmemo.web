import type { Dependency } from "@/src/common/di/locator-types";
import { locator_courses_CoursesRepository } from "@/src/courses/locators/locator_courses-repository";
import { locator_profile_GetMyProfileUseCase } from "@/src/profile/locators/locator_get-my-profile-use-case";
import { UpdateNoteUseCase } from "../domain/use-cases/update-note-use-case";
import { locator_notes_NotesRepository } from "./locator_notes-repository";

export const locator_notes_UpdateNoteUseCase: Dependency<
  UpdateNoteUseCase
> = () =>
  new UpdateNoteUseCase(
    locator_profile_GetMyProfileUseCase(),
    locator_courses_CoursesRepository(),
    locator_notes_NotesRepository(),
  );
