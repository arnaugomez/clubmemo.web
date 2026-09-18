import * as Schema from "effect/Schema";

import { CoursePermissionTypeModel } from "./course-permission-type-model";

export const CourseAuthorModelDataSchema = Schema.Struct({
  courseId: Schema.mutableKey(Schema.String),
  permissionType: Schema.mutableKey(Schema.Enum(CoursePermissionTypeModel)),
  profileId: Schema.mutableKey(Schema.String),
  displayName: Schema.mutableKey(Schema.optional(Schema.NullOr(Schema.String))),
  picture: Schema.mutableKey(Schema.optional(Schema.NullOr(Schema.String))),
  handle: Schema.mutableKey(Schema.optional(Schema.NullOr(Schema.String))),
});
export type CourseAuthorModelData = typeof CourseAuthorModelDataSchema.Type;

/**
 * An author of a course. The author is a profile that has permission to edit the
 * course or has created the course.
 */
export class CourseAuthorModel extends Schema.Class<CourseAuthorModel>(
  "CourseAuthorModel",
)({ data: CourseAuthorModelDataSchema }) {
  constructor(data: CourseAuthorModelData) {
    super({ data });
  }
  get courseId() {
    return this.data.courseId;
  }
  get permissionType() {
    return this.data.permissionType;
  }

  get profileId() {
    return this.data.profileId;
  }
  get displayName() {
    return this.data.displayName ?? undefined;
  }
  get picture() {
    return this.data.picture ?? undefined;
  }
  get handle() {
    return this.data.handle ?? undefined;
  }
}
