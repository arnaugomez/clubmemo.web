import { ObjectId } from "mongodb";
import { KeepLearningModel } from "../../domain/models/keep-learning-model";

export interface KeepLearningAggregationDoc {
  courseId: ObjectId;
  name: string;
  description: string;
  picture: string;
  tags: string[];
  dueCount: number;
  newCount: number;
}

export class KeepLearningAggregationDocTransformer {
  constructor(private readonly doc: KeepLearningAggregationDoc) {}
  toDomain() {
    return new KeepLearningModel({
      courseId: this.doc.courseId.toHexString(),
      name: this.doc.name,
      description: this.doc.description,
      picture: this.doc.picture,
      tags: this.doc.tags,
      dueCount: this.doc.dueCount,
      newCount: this.doc.newCount,
    });
  }
}
