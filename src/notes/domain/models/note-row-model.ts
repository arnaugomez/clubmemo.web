/**
 * Simple interface of the data of a practice note that can be used in multiple domains of the app.
 */
export interface NoteRowModel {
  /**
   * Question or front side of the note.
   */
  front: string;
  /**
   * Answer or back side of the note.
   */
  back: string;
}
