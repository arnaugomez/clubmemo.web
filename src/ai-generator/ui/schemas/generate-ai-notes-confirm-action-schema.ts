import { z } from "@/i18n/zod";
import { ObjectIdSchema } from "@/src/common/schemas/object-id-schema";

export const GenerateAiNotesConfirmActionSchema = z.object({
  courseId: ObjectIdSchema,
  notes: z.array(
    z.object({
      front: z.string(),
      back: z.string(),
    }),
  ),
});

export type GenerateAiNotesConfirmActionModel = z.infer<
  typeof GenerateAiNotesConfirmActionSchema
>;
