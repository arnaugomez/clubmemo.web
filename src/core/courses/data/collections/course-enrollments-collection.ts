import { collection } from "@/src/core/common/utils/mongo";
import { ObjectId, WithId } from "mongodb";
import { CourseEnrollmentModel } from "../../domain/models/course-enrollment-model";

export interface CourseEnrollmentConfigDoc {
  enableFuzz?: boolean;
  maximumInterval?: number;
  requestRetention?: number;
  dailyNewCardsCount?: number;
  showAdvancedRatingOptions?: boolean;
}

export interface CourseEnrollmentDoc {
  courseId: ObjectId;
  profileId: ObjectId;
  isFavorite: boolean;
  config?: CourseEnrollmentConfigDoc;
}
export const courseEnrollmentsCollection =
  collection<CourseEnrollmentDoc>("courseEnrollments");

export class CourseEnrollmentDocTransformer {
  constructor(private readonly doc: WithId<CourseEnrollmentDoc>) {}

  toDomain(): CourseEnrollmentModel {
    const { _id, ...rest } = this.doc;
    return new CourseEnrollmentModel({
      ...rest,
      id: _id.toString(),
      courseId: this.doc.courseId.toString(),
      profileId: this.doc.profileId.toString(),
    });
  }
}
