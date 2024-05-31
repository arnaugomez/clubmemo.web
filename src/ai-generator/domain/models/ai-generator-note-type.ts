/**
 * The type of notes created by the AI generator: question and answer, lists to
 * memorize, definitions of concepts, etc.
 */
export enum AiGeneratorNoteType {
  /** A note that contains a question and an answer */
  qa = "qa",
  /** A note that contains a list of items */
  list = "list",
  /** A note that contains a definition of a concept*/
  definition = "definition",
}
