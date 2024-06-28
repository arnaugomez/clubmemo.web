import { describe, expect, it } from "vitest";
import { PracticeCardRatingModel } from "./practice-card-rating-model";
import { PracticeCardStateModel } from "./practice-card-state-model";
import type { ReviewLogModelData } from "./review-log-model";
import { ReviewLogModel } from "./review-log-model";

describe("ReviewLogModel", () => {
  it("data matches constructor data", () => {
    const data: ReviewLogModelData = {
      id: "id",
      cardId: "cardId",
      courseEnrollmentId: "wwvwa;fj",
      rating: PracticeCardRatingModel.again,
      state: PracticeCardStateModel.new,
      due: new Date(),
      stability: 0,
      difficulty: 0,
      elapsedDays: 0,
      lastElapsedDays: 0,
      scheduledDays: 0,
      review: new Date(),
    };
    expect(new ReviewLogModel(data).data).toEqual(data);
  });
});
