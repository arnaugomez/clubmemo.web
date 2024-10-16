import type { Dependency } from "@/src/common/di/locator-types";
import { locator_courses_CoursesRepository } from "@/src/courses/locators/locator_courses-repository";
import { locator_notes_NotesRepository } from "@/src/notes/locators/locator_notes-repository";
import { locator_profile_GetMyProfileUseCase } from "@/src/profile/locators/locator_get-my-profile-use-case";
import { GenerateAiNotesConfirmUseCase } from "../domain/use-cases/generate-ai-notes-confirm-use-case";

export const locator_aiGenerator_GenerateAiNotesConfirmUseCase: Dependency<
  GenerateAiNotesConfirmUseCase
> = () =>
  new GenerateAiNotesConfirmUseCase(
    locator_profile_GetMyProfileUseCase(),
    locator_courses_CoursesRepository(),
    locator_notes_NotesRepository(),
  );
