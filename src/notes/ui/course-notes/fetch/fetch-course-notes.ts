import { locator } from "@/src/common/locator";
import type { GetNotesInputModel } from "@/src/notes/domain/models/get-notes-input-model";

export async function fetchCourseNotes(input: GetNotesInputModel) {
  const notesRepository = await locator.NotesRepository();
  return await notesRepository.get(input);
}
