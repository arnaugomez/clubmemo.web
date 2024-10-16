import { DatabaseServiceImpl } from "@/src/common/data/services/database-service-impl";
import { singleton } from "@/src/common/di/locator-utils";
import { locator_common_DatabaseService } from "@/src/common/locators/locator_database-service";
import { locator_common_EnvService } from "@/src/common/locators/locator_env-service";
import { ObjectId } from "mongodb";
import { beforeEach } from "node:test";
import { describe, expect, it, vi } from "vitest";
import { PracticeCardRatingModel } from "../../domain/models/practice-card-rating-model";
import { PracticeCardStateModel } from "../../domain/models/practice-card-state-model";
import { ReviewLogModel } from "../../domain/models/review-log-model";
import { locator_practice_ReviewLogsRepository } from "../../locators/locator_review-logs-repository";
import { reviewLogsCollection } from "../collections/review-logs-collection";

vi.mock("@/src/common/locators/locator_database-service", () => ({
  locator_common_DatabaseService: singleton(
    () =>
      new DatabaseServiceImpl(
        locator_common_EnvService(),
        "ReviewLogsRepositoryImpl",
      ),
  ),
}));

describe("ReviewLogsRepositoryImpl", () => {
  beforeEach(async () => {
    const databaseService = locator_common_DatabaseService();
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

    const reviewLogsRepository = locator_practice_ReviewLogsRepository();
    const newReviewLog = await reviewLogsRepository.create(reviewLog);

    expect(reviewLog.data.id).toBe("");
    expect(newReviewLog.data.id).not.toBe("");

    const databaseService = locator_common_DatabaseService();
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
