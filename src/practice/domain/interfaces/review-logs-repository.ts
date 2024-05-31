import type { ReviewLogModel } from "../models/review-log-model";

/**
 * Repository for review logs.
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
export interface ReviewLogsRepository {
  /**
   * Creates a new review log. Call this method when the learner reviews a card.
   *
   * @param input The data of the created review log
   * @returns The created review log
   */
  create(input: ReviewLogModel): Promise<ReviewLogModel>;

  /**
   * Get the amount of new cards that a learner has reviewed **today**.
   *
   * @param courseEnrollmentId The id of the course enrollment of the learner
   * @returns The amount of new cards reviewed today
   */
  getReviewsOfNewCardsCount(courseEnrollmentId: string): Promise<number>;
}
