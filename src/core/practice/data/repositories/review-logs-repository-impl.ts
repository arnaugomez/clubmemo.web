import { DateTimeService } from "@/src/core/common/domain/interfaces/date-time-service";
import { MongoService } from "@/src/core/common/domain/interfaces/mongo-service";
import { ObjectId } from "mongodb";
import { ReviewLogsRepository } from "../../domain/interfaces/review-logs-repository";
import { PracticeCardStateModel } from "../../domain/models/practice-card-state-model";
import { ReviewLogModel } from "../../domain/models/review-log-model";
import { reviewLogsCollection } from "../collections/review-logs-collection";

export class ReviewLogsRepositoryImpl implements ReviewLogsRepository {
  private readonly reviewLogs: typeof reviewLogsCollection.type;

  constructor(
    mongoService: MongoService,
    private readonly dateTimeService: DateTimeService,
  ) {
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
    input.data.id = result.insertedId.toString();
    return new ReviewLogModel(input.data);
  }

  async getReviewsOfNewCardsCount(courseEnrollmentId: string): Promise<number> {
    const cursor = this.reviewLogs.aggregate<{ count: number }>([
      {
        $match: {
          courseEnrollmentId: new ObjectId(courseEnrollmentId),
          review: { $gte: this.dateTimeService.getStartOfToday() },
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
