import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import * as ManagedRuntime from "effect/ManagedRuntime";
import { afterAll } from "vitest";
import { DatabaseService } from "@/src/common/domain/interfaces/database-service";
import { DateTimeServiceLive } from "@/src/common/layers/layer_datetime-service";
import { testDatabaseLayer } from "@/test/utils/database";
import {
  ReviewLogsRepository,
  ReviewLogsRepositoryLive,
} from "../../layers/layer_review-logs-repository";

const runtime = ManagedRuntime.make(
  ReviewLogsRepositoryLive.pipe(
    Layer.provideMerge(Layer.mergeAll(testDatabaseLayer, DateTimeServiceLive)),
  ),
);
afterAll(() => runtime.dispose());

import { ObjectId } from "mongodb";
import { beforeEach, describe, expect, it } from "vitest";
import { PracticeCardRatingModel } from "../../domain/models/practice-card-rating-model";
import { PracticeCardStateModel } from "../../domain/models/practice-card-state-model";
import { ReviewLogModel } from "../../domain/models/review-log-model";
import { reviewLogsCollection } from "../collections/review-logs-collection";

describe("ReviewLogsRepositoryImpl", () => {
  beforeEach(async () => {
    const databaseService = await runtime.runPromise(DatabaseService);
    await databaseService.collection(reviewLogsCollection).deleteMany();
  });
  it("create writes a new review log to the database and creates a new review log object with the id of the inserted object", async () => {
    const reviewLog = new ReviewLogModel({
      id: "",
      cardId: new ObjectId().toString(),
      courseEnrollmentId: new ObjectId().toString(),
      rating: PracticeCardRatingModel.good,
      state: PracticeCardStateModel.learning,
      due: new Date(),
      stability: 0,
      difficulty: 0,
      elapsedDays: 0,
      lastElapsedDays: 0,
      scheduledDays: 0,
      review: new Date(),
    });

    const reviewLogsRepository = await runtime.runPromise(ReviewLogsRepository);
    const newReviewLog = await Effect.runPromise(
      reviewLogsRepository.create(reviewLog),
    );

    expect(reviewLog.data.id).toBe("");
    expect(newReviewLog.data.id).not.toBe("");

    const databaseService = await runtime.runPromise(DatabaseService);
    const insertedDocument = await databaseService
      .collection(reviewLogsCollection)
      .findOne({ _id: new ObjectId(newReviewLog.data.id) });
    expect(insertedDocument).not.toBe(null);
    expect(insertedDocument?.cardId.toString()).toBe(
      new ObjectId(reviewLog.data.cardId).toString(),
    );
    expect(insertedDocument?.courseEnrollmentId.toString()).toBe(
      new ObjectId(reviewLog.data.courseEnrollmentId).toString(),
    );
    expect(insertedDocument?.rating).toBe(reviewLog.data.rating);
    expect(insertedDocument?.state).toBe(reviewLog.data.state);
    expect(insertedDocument?.due).toEqual(reviewLog.data.due);
    expect(insertedDocument?.stability).toBe(reviewLog.data.stability);
    expect(insertedDocument?.difficulty).toBe(reviewLog.data.difficulty);
    expect(insertedDocument?.elapsedDays).toBe(reviewLog.data.elapsedDays);
    expect(insertedDocument?.lastElapsedDays).toBe(
      reviewLog.data.lastElapsedDays,
    );
    expect(insertedDocument?.scheduledDays).toBe(reviewLog.data.scheduledDays);
    expect(insertedDocument?.review).toEqual(reviewLog.data.review);
  });
});
