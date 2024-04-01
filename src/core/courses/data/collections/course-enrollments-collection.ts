import { collection } from "@/src/core/app/utils/mongo";
import { ObjectId, WithId } from "mongodb";
import { CourseEnrollmentModel } from "../../domain/models/course-enrollment-model";

export interface CourseEnrollmentDoc {
  courseId: ObjectId;
  profileId: ObjectId;
  isFavourite: boolean;
}
export const courseEnrollmentsCollection =
  collection<CourseEnrollmentDoc>("courseEnrollments");

export class CourseEnrollmentDocTransformer {
  constructor(private readonly doc: WithId<CourseEnrollmentDoc>) {}

  toDomain(): CourseEnrollmentModel {
    return new CourseEnrollmentModel({
      ...this.doc,
      id: this.doc._id.toString(),
      courseId: this.doc.courseId.toString(),
      profileId: this.doc.profileId.toString(),
    });
  }
}
