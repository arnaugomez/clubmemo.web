import { ObjectId } from "mongodb";
import { z } from "zod";

export const CreateNoteActionSchema = z.object({
  courseId: z.string().refine(ObjectId.isValid),
  front: z.string().min(1).max(1000),
  back: z.string().min(0).max(10000),
});

export type CreateNoteActionModel = z.infer<typeof CreateNoteActionSchema>;