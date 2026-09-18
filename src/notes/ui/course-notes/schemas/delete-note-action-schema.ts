import * as Schema from "effect/Schema";

import { ObjectIdSchema } from "@/src/common/schemas/object-id-schema";

/**
 * Validates the parameters of `deleteNoteAction`
 * @see `deleteNoteAction`
 * @see `DeleteNoteActionModel`
 */
export const DeleteNoteActionSchema = Schema.Struct({
  noteId: ObjectIdSchema,
});

/**
 * Parameters of `deleteNoteAction`
 */
export type DeleteNoteActionModel = (typeof DeleteNoteActionSchema)["Type"];
