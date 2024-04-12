import { locator } from "@/src/core/common/locator";
import { GetNotesInputModel } from "@/src/core/notes/domain/models/get-notes-input-model";

export async function fetchCourseNotes(input: GetNotesInputModel) {
  const notesRepository = await locator.NotesRepository();
  return await notesRepository.get(input);
}
