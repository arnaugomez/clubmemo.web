import { z } from "@/i18n/zod";
import { ObjectIdSchema } from "@/src/common/schemas/object-id-schema";

export const CreateNoteActionSchema = z.object({
  courseId: ObjectIdSchema,
  front: z.string().min(1).max(1000),
  back: z.string().min(0).max(10000),
});

export type CreateNoteActionModel = z.infer<typeof CreateNoteActionSchema>;
