import { notesCollection } from "@/src/notes/data/collections/notes-collection";
import { practiceCardsCollection } from "@/src/practice/data/collections/practice-cards-collection";
import type { Document } from "mongodb";


export const newCardsLookupPipelineStage: Document = {
  $lookup: {
    from: notesCollection.name,
    let: { courseId: "$courseId", courseEnrollmentId: "$_id" },
    pipeline: [
      {
        $match: {
          $expr: {
            $eq: ["$courseId", "$$courseId"],
          },
        },
      },
      {
        $lookup: {
          from: practiceCardsCollection.name,
          let: {
            noteId: "$_id",
            courseEnrollmentId: "$$courseEnrollmentId",
          },
          pipeline: [
            {
              $match: {
                $and: [
                  {
                    $expr: {
                      $eq: ["$noteId", "$$noteId"],
                    },
                  },
                  {
                    $expr: {
                      $eq: ["$courseEnrollmentId", "$$courseEnrollmentId"],
                    },
                  },
                ],
              },
            },
            {
              $limit: 1,
            },
          ],
          as: "practiceCards",
        },
      },
      {
        $match: {
          practiceCards: { $size: 0 },
        },
      },
    ],
    as: "newCards",
  },
};
