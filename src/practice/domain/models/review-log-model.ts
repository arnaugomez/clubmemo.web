import type { PracticeCardRatingModel } from "./practice-card-rating-model";
import type { PracticeCardStateModel } from "./practice-card-state-model";

export interface ReviewLogModelData {
  id: string;
  cardId: string;
  courseEnrollmentId: string;

  rating: PracticeCardRatingModel;
  state: PracticeCardStateModel;
  due: Date;
  stability: number;
  difficulty: number;
  elapsedDays: number;
  lastElapsedDays: number;
  scheduledDays: number;
  review: Date;
}

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
export class ReviewLogModel {
  constructor(readonly data: ReviewLogModelData) {}
}
