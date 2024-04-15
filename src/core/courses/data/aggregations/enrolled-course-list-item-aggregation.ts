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
      courseId: this.doc.courseId.toString(),
      name: this.doc.name,
      picture: this.doc.picture,
      isFavorite: this.doc.isFavorite,
      dueCount: this.doc.dueCount,
      newCount: this.doc.newCount,
    });
  }
}
