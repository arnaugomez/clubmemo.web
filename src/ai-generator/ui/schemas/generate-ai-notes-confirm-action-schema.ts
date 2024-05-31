import { z } from "@/i18n/zod";
import { ObjectIdSchema } from "@/src/common/schemas/object-id-schema";

/**
 * Validates the parameters of `generateAiNotesConfirmAction`
 */
export const GenerateAiNotesConfirmActionSchema = z.object({
  courseId: ObjectIdSchema,
  notes: z.array(
    z.object({
      front: z.string(),
      back: z.string(),
    }),
  ),
});

/**
 * Parameters of `generateAiNotesConfirmAction`
 */
export type GenerateAiNotesConfirmActionModel = z.infer<
  typeof GenerateAiNotesConfirmActionSchema
>;
