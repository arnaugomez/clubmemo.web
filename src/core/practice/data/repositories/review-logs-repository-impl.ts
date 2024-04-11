import { MongoService } from "@/src/core/app/domain/interfaces/mongo-service";
import {
  ReviewLogsRepository,
  GetReviewsOfNewCardsCountInputModel,
} from "../../domain/interfaces/review-logs-repository";
import { PracticeCardStateModel } from "../../domain/models/practice-card-state-model";
import { reviewLogsCollection } from "../collections/review-logs-collection";
import { ReviewLogModel } from "../../domain/models/review-log-model";
import { ObjectId } from "mongodb";

export class ReviewLogsRepositoryImpl implements ReviewLogsRepository {
  private readonly reviewLogs: typeof reviewLogsCollection.type;

  constructor(mongoService: MongoService) {
    this.reviewLogs = mongoService.collection(reviewLogsCollection);
  }

  async create(input: ReviewLogModel): Promise<ReviewLogModel> {
    const result = await this.reviewLogs.insertOne({
      cardId: new ObjectId(input.data.cardId),
      courseEnrollmentId: new ObjectId(input.data.courseEnrollmentId),
      rating: input.data.rating,
      state: input.data.state,
      due: input.data.due,
      stability: input.data.stability,
      difficulty: input.data.difficulty,
      elapsedDays: input.data.elapsedDays,
      lastElapsedDays: input.data.lastElapsedDays,
      scheduledDays: input.data.scheduledDays,
      review: input.data.review,
    });
    input.data.id = result.insertedId.toHexString();
    return new ReviewLogModel(input.data);
  }

  async getReviewsOfNewCardsCount(
    input: GetReviewsOfNewCardsCountInputModel,
  ): Promise<number> {
    const cursor = this.reviewLogs.aggregate<{ count: number }>([
      {
        $match: {
          courseEnrollmentId: new ObjectId(input.courseEnrollmentId),
          review: { $gte: input.minDate },
          state: PracticeCardStateModel.new,
        },
      },
      {
        $group: {
          _id: null,
          count: { $sum: 1 },
        },
      },
    ]);
    const count = await cursor.next();
    return count?.count ?? 0;
  }
}
