import type { Dependency } from "@/src/common/di/locator-types";
import { GetNotesUseCase } from "../domain/use-cases/get-notes-use-case";
import { locator_notes_NotesRepository } from "./locator_notes-repository";

export const locator_notes_GetNotesUseCase: Dependency<GetNotesUseCase> = () =>
  new GetNotesUseCase(locator_notes_NotesRepository());
