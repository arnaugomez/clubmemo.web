import { z } from "@/i18n/zod";
import { ObjectIdSchema } from "@/src/common/schemas/object-id-schema";

/**
 * Validates the parameters of `deleteNoteAction`
 * @see `deleteNoteAction`
 * @see `DeleteNoteActionModel`
 */
export const DeleteNoteActionSchema = z.object({
  noteId: ObjectIdSchema,
});

/**
 * Parameters of `deleteNoteAction`
 */
export type DeleteNoteActionModel = z.infer<typeof DeleteNoteActionSchema>;
