import * as Schema from "effect/Schema";

export const EnrolledCourseListItemModelDataSchema = Schema.Struct({
  courseId: Schema.mutableKey(Schema.String),
  name: Schema.mutableKey(Schema.String),
  picture: Schema.mutableKey(Schema.optional(Schema.NullOr(Schema.String))),
  isFavorite: Schema.mutableKey(Schema.Boolean),
  dueCount: Schema.mutableKey(Schema.Number),
  newCount: Schema.mutableKey(Schema.Number),
});
export type EnrolledCourseListItemModelData =
  typeof EnrolledCourseListItemModelDataSchema.Type;

/**
 * A list item containing the data of an enrolled course.
 */
export class EnrolledCourseListItemModel extends Schema.Class<EnrolledCourseListItemModel>(
  "EnrolledCourseListItemModel",
)({ data: EnrolledCourseListItemModelDataSchema }) {
  constructor(data: EnrolledCourseListItemModelData) {
    super({ data });
  }

  get courseId() {
    return this.data.courseId;
  }

  get name() {
    return this.data.name;
  }

  get picture() {
    return this.data.picture ?? undefined;
  }

  get isFavorite() {
    return this.data.isFavorite;
  }

  get dueCount() {
    return this.data.dueCount;
  }

  get newCount() {
    return this.data.newCount;
  }

  /**
   * Whether the course has any due or new cards left to practice.
   */
  get shouldPractice() {
    return this.data.dueCount > 0 || this.data.newCount > 0;
  }
}
