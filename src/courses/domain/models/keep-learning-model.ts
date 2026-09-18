import * as Schema from "effect/Schema";

export const KeepLearningModelDataSchema = Schema.Struct({
  courseId: Schema.mutableKey(Schema.String),
  name: Schema.mutableKey(Schema.String),
  description: Schema.mutableKey(Schema.optional(Schema.NullOr(Schema.String))),
  picture: Schema.mutableKey(Schema.optional(Schema.NullOr(Schema.String))),
  tags: Schema.mutableKey(
    Schema.optional(Schema.NullOr(Schema.mutable(Schema.Array(Schema.String)))),
  ),
  dueCount: Schema.mutableKey(Schema.Number),
  newCount: Schema.mutableKey(Schema.Number),
});
export type KeepLearningModelData = typeof KeepLearningModelDataSchema.Type;

/**
 * A recommendation of a course that the user should keep practicing,
 * because there are due or new cards to review.
 */
export class KeepLearningModel extends Schema.Class<KeepLearningModel>(
  "KeepLearningModel",
)({ data: KeepLearningModelDataSchema }) {
  constructor(data: KeepLearningModelData) {
    super({ data });
  }

  get courseId() {
    return this.data.courseId;
  }

  get name() {
    return this.data.name;
  }
  get description() {
    return this.data.description ?? undefined;
  }

  get picture() {
    return this.data.picture ?? undefined;
  }

  get tags() {
    return this.data.tags ?? undefined;
  }

  get dueCount() {
    return this.data.dueCount;
  }

  get newCount() {
    return this.data.newCount;
  }

  get shouldPractice() {
    return this.data.dueCount > 0 || this.data.newCount > 0;
  }
}
