import { ObjectId } from "mongodb";
import { z } from "zod";

export const GenerateAiNotesConfirmActionSchema = z.object({
  courseId: z.string().refine(ObjectId.isValid),
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
