import { ObjectId } from "mongodb";
import { default_maximum_interval } from "ts-fsrs";
import { z } from "zod";

export const EditCourseConfigActionSchema = z.object({
  enrollmentId: z.string().refine(ObjectId.isValid),
  enableFuzz: z.boolean(),
  maximumInterval: z.number().min(1).max(default_maximum_interval),
  requestRetention: z.number().min(0).max(1),
  dailyNewCardsCount: z.number().min(1).max(100),
  showAdvancedRatingOptions: z.boolean(),
});

export type EditCourseConfigActionModel = z.infer<
  typeof EditCourseConfigActionSchema
>;
