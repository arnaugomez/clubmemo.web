import { practiceCardsCollection } from "@/src/practice/data/collections/practice-cards-collection";
import type { Document } from "mongodb";

export const getDueCardsLookupPipelineStage = (
  startOfTomorrow: Date,
): Document => ({
  $lookup: {
    from: practiceCardsCollection.name,
    let: { courseEnrollmentId: "$_id" },
    pipeline: [
      {
        $match: {
          $expr: {
            $eq: ["$courseEnrollmentId", "$$courseEnrollmentId"],
          },
          due: { $lte: startOfTomorrow },
        },
      },
    ],
    as: "dueCards",
  },
});
