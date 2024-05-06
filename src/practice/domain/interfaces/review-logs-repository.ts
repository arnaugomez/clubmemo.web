import type { ReviewLogModel } from "../models/review-log-model";

export interface ReviewLogsRepository {
  create(input: ReviewLogModel): Promise<ReviewLogModel>;

  getReviewsOfNewCardsCount(courseEnrollmentId: string): Promise<number>;
}
