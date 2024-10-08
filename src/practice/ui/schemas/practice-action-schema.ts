import { z } from "@/i18n/zod";
import { ObjectIdSchema } from "@/src/common/schemas/object-id-schema";
import { PracticeCardRatingModelSchema } from "../../domain/schemas/practice-card-rating-model-schema";
import { PracticeCardStateModelSchema } from "../../domain/schemas/practice-card-state-model-schema";

/**
 * Validates the parameters of `practiceAction`
 */
export const PracticeActionSchema = z.object({
  courseId: ObjectIdSchema,
  card: z.object({
    id: z.string(),
    courseEnrollmentId: z.string(),
    note: z.object({
      id: z.string(),
      courseId: z.string(),
      front: z.string(),
      back: z.string(),
      createdAt: z.date(),
    }),
    provisionalId: z.number().int().optional(),
    due: z.date(),
    stability: z.number(),
    difficulty: z.number(),
    elapsedDays: z.number().int(),
    scheduledDays: z.number().int(),
    reps: z.number().int(),
    lapses: z.number().int(),
    state: PracticeCardStateModelSchema,
    lastReview: z.date().optional(),
  }),
  reviewLog: z.object({
    id: z.string(),
    cardId: z.string(),
    courseEnrollmentId: z.string(),
    rating: PracticeCardRatingModelSchema,
    state: PracticeCardStateModelSchema,
    due: z.date(),
    stability: z.number(),
    difficulty: z.number(),
    elapsedDays: z.number().int(),
    lastElapsedDays: z.number().int(),
    scheduledDays: z.number().int(),
    review: z.date(),
  }),
});

/**
 * Parameters of `practiceAction`
 */
export type PracticeActionModel = z.infer<typeof PracticeActionSchema>;
