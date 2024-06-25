import type { PaginationModel } from "@/src/common/domain/models/pagination-model";
import type { NotesRepository } from "../interfaces/notes-repository";
import type { GetNotesInputModel } from "../models/get-notes-input-model";
import type { NoteModel } from "../models/note-model";

/**
 * Gets a paginated list of the notes of a course
 *
 * @input The course id and a pagination cursor
 * @returns A paginated list of the notes of the course
 */
export class GetNotesUseCase {
  constructor(private readonly notesRepository: NotesRepository) {}

  /**
   * Gets a paginated list of the notes of a course
   *
   * @input The course id and a pagination cursor
   * @returns A paginated list of the notes of the course
   */
  async execute(
    input: GetNotesInputModel,
  ): Promise<PaginationModel<NoteModel>> {
    return await this.notesRepository.get(input);
  }
}
