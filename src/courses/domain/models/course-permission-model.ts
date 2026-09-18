import * as Schema from "effect/Schema";

import { CoursePermissionTypeModel } from "./course-permission-type-model";

export const CoursePermissionModelDataSchema = Schema.Struct({
  id: Schema.mutableKey(Schema.String),
  courseId: Schema.mutableKey(Schema.String),
  profileId: Schema.mutableKey(Schema.String),
  permissionType: Schema.mutableKey(Schema.Enum(CoursePermissionTypeModel)),
});
export type CoursePermissionModelData =
  typeof CoursePermissionModelDataSchema.Type;

/**
 * A permission to view, edit, delete a course.
 * There are different types of permissions, defined in the `CoursePermissionTypeModel` enum.
 * @see CoursePermissionTypeModel
 */
export class CoursePermissionModel extends Schema.Class<CoursePermissionModel>(
  "CoursePermissionModel",
)({ data: CoursePermissionModelDataSchema }) {
  constructor(data: CoursePermissionModelData) {
    super({ data });
  }

  get id() {
    return this.data.id;
  }

  get courseId() {
    return this.data.courseId;
  }

  get profileId() {
    return this.data.profileId;
  }

  get permissionType() {
    return this.data.permissionType;
  }
}
