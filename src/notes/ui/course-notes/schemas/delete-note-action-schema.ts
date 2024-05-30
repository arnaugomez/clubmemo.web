import { z } from "@/i18n/zod";
import { ObjectIdSchema } from "@/src/common/schemas/object-id-schema";

export const DeleteNoteActionSchema = z.object({
  noteId: ObjectIdSchema,
});

export type DeleteNoteActionModel = z.infer<typeof DeleteNoteActionSchema>;
