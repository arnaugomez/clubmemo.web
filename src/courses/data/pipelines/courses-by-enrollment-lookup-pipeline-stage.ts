import type { Document } from "mongodb";

export const coursesByEnrollmentLookupPipelineStages: Document[] = [
  {
    $lookup: {
      from: "courses",
      localField: "courseId",
      foreignField: "_id",
      as: "course",
    },
  },
  {
    $unwind: "$course",
  },
];
