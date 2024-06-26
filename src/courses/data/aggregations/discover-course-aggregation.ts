import type { WithId } from "mongodb";
import { DiscoverCourseModel } from "../../domain/models/discover-course-model";

export interface DiscoverCourseDoc {
  name: string;
  description?: string;
  picture?: string;
  tags?: string[];
}

export class DiscoverCourseTransformer {
  constructor(private readonly doc: WithId<DiscoverCourseDoc>) {}

  toDomain() {
    const { _id, ...rest } = this.doc;
    return new DiscoverCourseModel({
      ...rest,
      id: _id.toString(),
    });
  }
}
