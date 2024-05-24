import { ObjectId } from "mongodb";
import { z } from "zod";
import { PracticeCardStateModel } from "../../domain/models/practice-card-state-model";
import { PracticeCardRatingModel } from "../../domain/models/practice-card-rating-model";

const PracticeCardStateModelSchema = z.enum([
  PracticeCardStateModel.learning,
  PracticeCardStateModel.new,
  PracticeCardStateModel.relearning,
  PracticeCardStateModel.review,
]);

export const PracticeActionSchema = z.object({
  courseId: z.string().refine(ObjectId.isValid),
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
    rating: z.enum([
      PracticeCardRatingModel.again,
      PracticeCardRatingModel.easy,
      PracticeCardRatingModel.good,
      PracticeCardRatingModel.hard,
      PracticeCardRatingModel.manual,
    ]),
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

export type PracticeActionModel = z.infer<typeof PracticeActionSchema>;
