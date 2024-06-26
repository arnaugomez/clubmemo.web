import { z } from "@/i18n/zod";
import { ObjectIdSchema } from "@/src/common/schemas/object-id-schema";

/**
 * Validates the parameters of `getNextPracticeCardsAction`
 */
export const GetNextPracticeCardsActionSchema = z.object({
  courseId: ObjectIdSchema,
});

/**
 * The parameters of `getNextPracticeCardsAction`
 */
export type GetNextPracticeCardsActionModel = z.infer<
  typeof GetNextPracticeCardsActionSchema
>;
