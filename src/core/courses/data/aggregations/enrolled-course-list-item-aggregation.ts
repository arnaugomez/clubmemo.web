import { ObjectId } from "mongodb";
import { EnrolledCourseListItemModel } from "../../domain/models/enrolled-course-list-item-model";

export interface EnrolledCourseListItemDoc {
  courseId: ObjectId;
  name: string;
  picture: string;
  isFavorite: boolean;
  dueCount: number;
  newCount: number;
}

export class EnrolledCourseListItemTransformer {
  constructor(private readonly doc: EnrolledCourseListItemDoc) {}

  toDomain() {
    return new EnrolledCourseListItemModel({
      ...this.doc,
      courseId: this.doc.courseId.toString(),
    });
  }
}
