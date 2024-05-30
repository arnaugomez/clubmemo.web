import { reviewLogsCollection } from "@/src/practice/data/collections/review-logs-collection";
import { PracticeCardStateModel } from "@/src/practice/domain/models/practice-card-state-model";
import type { Document } from "mongodb";

export const getReviewsOfNewCardsLookupPipelineStage = (
  startOfToday: Date,
): Document => ({
  $lookup: {
    from: reviewLogsCollection.name,
    let: { courseEnrollmentId: "$_id" },
    pipeline: [
      {
        $match: {
          $expr: {
            $eq: ["$courseEnrollmentId", "$$courseEnrollmentId"],
          },
          review: { $gte: startOfToday },
          state: PracticeCardStateModel.new,
        },
      },
    ],
    as: "reviewsOfNewCards",
  },
});
