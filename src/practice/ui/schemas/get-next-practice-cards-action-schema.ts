import { ObjectId } from "mongodb";
import { z } from "zod";

export const GetNextPracticeCardsActionSchema = z.object({
  courseId: z.string().refine(ObjectId.isValid),
});

export type GetNextPracticeCardsActionModel = z.infer<
  typeof GetNextPracticeCardsActionSchema
>;
