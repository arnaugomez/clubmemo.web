import { collection } from "@/src/common/data/utils/mongo";
import type { ObjectId, WithId } from "mongodb";
import { CourseEnrollmentModel } from "../../domain/models/course-enrollment-model";

export interface CourseEnrollmentDoc {
  courseId: ObjectId;
  profileId: ObjectId;

  isFavorite: boolean;
  config?: CourseEnrollmentConfigDoc;
}

export interface CourseEnrollmentConfigDoc {
  enableFuzz?: boolean;
  maximumInterval?: number;
  requestRetention?: number;
  dailyNewCardsCount?: number;
  showAdvancedRatingOptions?: boolean;
}

/**
 * Collection of MongoDB documents of type `CourseEnrollmentDoc`
 */
export const courseEnrollmentsCollection =
  collection<CourseEnrollmentDoc>("courseEnrollments");

export class CourseEnrollmentDocTransformer {
  constructor(private readonly doc: WithId<CourseEnrollmentDoc>) {}

  toDomain(): CourseEnrollmentModel {
    return new CourseEnrollmentModel({
      id: this.doc._id.toString(),
      courseId: this.doc.courseId.toString(),
      profileId: this.doc.profileId.toString(),

      isFavorite: this.doc.isFavorite,
      config: this.doc.config,
    });
  }
}
