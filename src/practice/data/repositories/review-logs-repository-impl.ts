import * as Effect from "effect/Effect";
import { ObjectId } from "mongodb";
import type { DatabaseService } from "@/src/common/domain/interfaces/database-service";
import type { DateTimeService } from "@/src/common/domain/interfaces/date-time-service";
import { ExternalServiceError } from "@/src/common/effect/errors";
import type { ReviewLogsRepository } from "../../domain/interfaces/review-logs-repository";
import { PracticeCardStateModel } from "../../domain/models/practice-card-state-model";
import { ReviewLogModel } from "../../domain/models/review-log-model";
import { reviewLogsCollection } from "../collections/review-logs-collection";

/**
 * Implementation of `ReviewLogsRepository` using the MongoDB database.
 */
export class ReviewLogsRepositoryImpl implements ReviewLogsRepository {
  private readonly reviewLogs: typeof reviewLogsCollection.type;

  constructor(
    databaseService: DatabaseService,
    private readonly dateTimeService: DateTimeService,
  ) {
    this.reviewLogs = databaseService.collection(reviewLogsCollection);
  }

  create = Effect.fn("ReviewLogsRepositoryImpl.create")(function* (
    this: ReviewLogsRepositoryImpl,
    input: ReviewLogModel,
  ) {
    const result = yield* Effect.tryPromise({
      try: () =>
        this.reviewLogs.insertOne({
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
        }),
      catch: (cause) =>
        new ExternalServiceError({
          operation: "ReviewLogsRepositoryImpl.create",
          cause,
        }),
    });
    return new ReviewLogModel({
      ...input.data,
      id: result.insertedId.toString(),
    });
  }).bind(this);

  getReviewsOfNewCardsCount = Effect.fn(
    "ReviewLogsRepositoryImpl.getReviewsOfNewCardsCount",
  )(function* (this: ReviewLogsRepositoryImpl, courseEnrollmentId: string) {
    const getStartOfToday = yield* this.dateTimeService.getStartOfToday();
    const cursor = this.reviewLogs.aggregate<{ count: number }>([
      {
        $match: {
          courseEnrollmentId: new ObjectId(courseEnrollmentId),
          review: { $gte: getStartOfToday },
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
    const count = yield* Effect.tryPromise({
      try: () => cursor.next(),
      catch: (cause) =>
        new ExternalServiceError({
          operation: "ReviewLogsRepositoryImpl.getReviewsOfNewCardsCount",
          cause,
        }),
    });
    return count?.count ?? 0;
  }).bind(this);
}
