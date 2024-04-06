import { Lazy, locator } from "../app/locator";
import type { CreateNoteUseCase } from "./domain/use-cases/create-note-use-case";
import type { DeleteNoteUseCase } from "./domain/use-cases/delete-note-use-case";
import type { ImportNotesUseCase } from "./domain/use-cases/import-notes-use-case";
import type { UpdateNoteUseCase } from "./domain/use-cases/update-note-use-case";
import type { GenerateAiNotesUseCase } from "./domain/use-cases/generate-ai-notes-use-case";

interface NotesLocator {
  CreateNoteUseCase: Lazy<CreateNoteUseCase>;
  UpdateNoteUseCase: Lazy<UpdateNoteUseCase>;
  DeleteNoteUseCase: Lazy<DeleteNoteUseCase>;
  ImportNotesUseCase: Lazy<ImportNotesUseCase>;
  GenerateAiNotesUseCase: Lazy<GenerateAiNotesUseCase>;
}

export const notesLocator: NotesLocator = {
  CreateNoteUseCase: async () => {
    const file = await import("./domain/use-cases/create-note-use-case");
    return new file.CreateNoteUseCase(
      await locator.CoursesRepository(),
      await locator.NotesRepository(),
    );
  },
  UpdateNoteUseCase: async () => {
    const file = await import("./domain/use-cases/update-note-use-case");
    return new file.UpdateNoteUseCase(
      await locator.CoursesRepository(),
      await locator.NotesRepository(),
    );
  },
  DeleteNoteUseCase: async () => {
    const file = await import("./domain/use-cases/delete-note-use-case");
    return new file.DeleteNoteUseCase(
      await locator.CoursesRepository(),
      await locator.NotesRepository(),
    );
  },
  ImportNotesUseCase: async () => {
    const file = await import("./domain/use-cases/import-notes-use-case");
    return new file.ImportNotesUseCase(
      await locator.CoursesRepository(),
      await locator.NotesRepository(),
    );
  },
  GenerateAiNotesUseCase: async () => {
    const file = await import("./domain/use-cases/generate-ai-notes-use-case");
    return new file.GenerateAiNotesUseCase(
      await locator.CoursesRepository(),
      await locator.NotesRepository(),
      await locator.AiNotesGeneratorService(),
    );
  },
};
