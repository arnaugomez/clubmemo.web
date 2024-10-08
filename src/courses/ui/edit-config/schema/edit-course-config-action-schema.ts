import { z } from "@/i18n/zod";
import { ObjectIdSchema } from "@/src/common/schemas/object-id-schema";
import { default_maximum_interval } from "ts-fsrs";

/**
 * Validates the parameters of `editCourseConfigAction`
 */
export const EditCourseConfigActionSchema = z.object({
  enrollmentId: ObjectIdSchema,
  enableFuzz: z.boolean(),
  maximumInterval: z.number().int().min(1).max(default_maximum_interval),
  requestRetention: z.number().min(0).max(1),
  dailyNewCardsCount: z.number().int().min(1).max(100),
  showAdvancedRatingOptions: z.boolean(),
});

/**
 * Parameters of `editCourseConfigAction`
 */
export type EditCourseConfigActionModel = z.infer<
  typeof EditCourseConfigActionSchema
>;
