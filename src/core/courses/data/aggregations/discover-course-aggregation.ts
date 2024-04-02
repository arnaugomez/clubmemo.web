import { ObjectId } from "mongodb";
import { DiscoverCourseModel } from "../../domain/models/discover-course-model";

export interface DiscoverCourseDoc {
  id: ObjectId;
  name: string;
  description?: string;
  picture?: string;
}

export class DiscoverCourseTransformer {
  constructor(private readonly doc: DiscoverCourseDoc) {}

  toDomain() {
    return new DiscoverCourseModel({
      ...this.doc,
      id: this.doc.id.toString(),
    });
  }
}
