import type { PaginationModel } from "@/src/common/domain/models/pagination-model";
import type { CopyNotesInputModel } from "../models/copy-notes-input-model";
import type { CreateNoteInputModel } from "../models/create-note-input-model";
import type { GetNotesInputModel } from "../models/get-notes-input-model";
import type { NoteModel } from "../models/note-model";
import type { NoteRowModel } from "../models/note-row-model";
import type { UpdateNoteInputModel } from "../models/update-note-input-model";

/**
 * Repository for notes.
 *
 * A note is a flashcard that contains a front and a back. The front usually
 * contains a question and the back contains the answer. It is used to learn a
 * topic by practicing the cards.
 *
 * A note is not the same thing as a card. A note contains the learning content
 * (question and answer, front and back) that the learner must memorize. A card
 * is generated from a note, and contains the status of the learner's
 * memorization process. The card keeps track of the learner's progress and its
 * data determines the next time the learner should practice the note.
 *
 * There can be multiple cards for a single note. If 3 users are learning the
 * same note, there will be 3 cards, one for each user.
 */
export interface NotesRepository {
  /**
   * Creates a new note
   *
   * @param input The data to create a note
   * @returns The created note
   */
  create(input: CreateNoteInputModel): Promise<NoteModel>;

  /**
   * Gets the detailed data of a note
   *
   * @param noteId The id of the note
   * @returns The detailed data of the note if the note exists, `null` otherwise
   */
  getDetail(noteId: string): Promise<NoteModel | null>;

  /**
   * Updates the data of a note. For example, its front text, back text, etc.
   *
   * @param input The data that needs to be updated
   */
  update(input: UpdateNoteInputModel): Promise<void>;

  /**
   * Deletes a note permanently. Also deletes all its associated practice cards.
   *
   * @param noteId The id of the note to delete
   */
  delete(noteId: string): Promise<void>;

  /**
   * Obtains the notes of a course
   *
   * @param input The query to get the notes, including the course id and a
   * pagination cursor
   * @returns A paginated list of notes
   */
  get(input: GetNotesInputModel): Promise<PaginationModel<NoteModel>>;

  /**
   * Copies notes from one course to another.
   *
   * The notes are copied as new notes, so the original notes are not modified.
   * The copied notes are not linked to the original notes, so changes in the
   * original notes do not affect the copied notes.
   *
   * @param input The data to copy notes from one course to another
   */
  copy(input: CopyNotesInputModel): Promise<void>;

  /**
   * Gets all the notes from a course in a simple format, consisting in the
   * front and back of the note (see `NoteRowModel` interface). This method is
   * helpful to export the notes to a file.
   *
   * @param courseId The course to get the notes from
   * @returns A list of notes in a simple format
   * @see NoteRowModel
   */
  getAllRows(courseId: string): Promise<NoteRowModel[]>;

  /**
   * Adds a list of notes to a course
   *
   * @param courseId The id of the course to add the notes to
   * @param notes A list of notes in a simple format, consisting in the front and back of the note.
   * @see NoteRowModel
   */
  createMany(courseId: string, notes: NoteRowModel[]): Promise<NoteModel[]>;
}
