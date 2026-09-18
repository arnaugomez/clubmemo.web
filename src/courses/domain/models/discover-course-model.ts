import * as Schema from "effect/Schema";

export const DiscoverCourseModelDataSchema = Schema.Struct({
  id: Schema.mutableKey(Schema.String),
  name: Schema.mutableKey(Schema.String),
  description: Schema.mutableKey(Schema.optional(Schema.NullOr(Schema.String))),
  picture: Schema.mutableKey(Schema.optional(Schema.NullOr(Schema.String))),
  tags: Schema.mutableKey(
    Schema.optional(Schema.NullOr(Schema.mutable(Schema.Array(Schema.String)))),
  ),
});
export type DiscoverCourseModelData = typeof DiscoverCourseModelDataSchema.Type;

/**
 * Contains the data of a course, as a result of a query to search courses
 */
export class DiscoverCourseModel extends Schema.Class<DiscoverCourseModel>(
  "DiscoverCourseModel",
)({ data: DiscoverCourseModelDataSchema }) {
  constructor(data: DiscoverCourseModelData) {
    super({ data });
  }

  get id() {
    return this.data.id;
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
    return this.data.tags ?? [];
  }
}
