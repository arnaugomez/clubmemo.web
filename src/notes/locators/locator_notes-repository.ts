import type { Dependency } from "@/src/common/di/locator-types";
import { locator_common_DatabaseService } from "@/src/common/locators/locator_database-service";
import { NotesRepositoryImpl } from "../data/repositories/notes-repository-impl";
import type { NotesRepository } from "../domain/interfaces/notes-repository";

export const locator_notes_NotesRepository: Dependency<
  NotesRepository
> = () => new NotesRepositoryImpl(locator_common_DatabaseService());
