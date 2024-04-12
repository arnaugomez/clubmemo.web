import { ReviewLogModel } from "../models/review-log-model";

export interface GetReviewsOfNewCardsCountInputModel {
  courseEnrollmentId: string;
  minDate: Date;
}

export interface ReviewLogsRepository {
  create(input: ReviewLogModel): Promise<ReviewLogModel>;

  getReviewsOfNewCardsCount(
    input: GetReviewsOfNewCardsCountInputModel,
  ): Promise<number>;
}
