import * as Schema from "effect/Schema";
export class NoteDoesNotExistError extends Schema.TaggedError<NoteDoesNotExistError>()(
  "NoteDoesNotExistError",
  {},
) {}
export class InvalidNoteImportTypeError extends Schema.TaggedError<InvalidNoteImportTypeError>()(
  "InvalidNoteImportTypeError",
  {},
) {}
