import { ObjectId } from "mongodb";
import { z } from "zod";

export const DeleteNoteActionSchema = z.object({
  noteId: z.string().refine(ObjectId.isValid)
});

export type DeleteNoteActionModel = z.infer<typeof DeleteNoteActionSchema>;