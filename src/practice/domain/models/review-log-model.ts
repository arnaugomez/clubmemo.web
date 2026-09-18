import * as Schema from "effect/Schema";

import { PracticeCardRatingModel } from "./practice-card-rating-model";
import { PracticeCardStateModel } from "./practice-card-state-model";

export const ReviewLogModelDataSchema = Schema.Struct({
  id: Schema.mutableKey(Schema.String),
  cardId: Schema.mutableKey(Schema.String),
  courseEnrollmentId: Schema.mutableKey(Schema.String),
  rating: Schema.mutableKey(Schema.Enum(PracticeCardRatingModel)),
  state: Schema.mutableKey(Schema.Enum(PracticeCardStateModel)),
  due: Schema.mutableKey(Schema.Date),
  stability: Schema.mutableKey(Schema.Number),
  difficulty: Schema.mutableKey(Schema.Number),
  elapsedDays: Schema.mutableKey(Schema.Number),
  lastElapsedDays: Schema.mutableKey(Schema.Number),
  scheduledDays: Schema.mutableKey(Schema.Number),
  review: Schema.mutableKey(Schema.Date),
});
export type ReviewLogModelData = typeof ReviewLogModelDataSchema.Type;

/**
 * A log of a review of a practice card.
 *
 * Review logs keep track of the learner's progress in reviewing a certain card.
 * The review log is a relationship between a card and a course enrollment.
 * Every time the learner reviews a card, a new review log is created.
 *
 * These logs can be used to analyze the learner's progress and to determine the
 * next time the learner should review the card. They can also be used to
 * generate reports and statistics about the learner's progress, providing
 * insights and data so the learner can make informed decisions about their
 * learning.
 *
 * Furthermore, they can be combined with machine learning techniques to find
 * the optimal parameters of the learning algorithm.
 */
export class ReviewLogModel extends Schema.Class<ReviewLogModel>(
  "ReviewLogModel",
)({ data: ReviewLogModelDataSchema }) {
  constructor(data: ReviewLogModelData) {
    super({ data });
  }
}
