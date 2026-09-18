import * as Schema from "effect/Schema";
import { CourseEnrollmentModelDataSchema } from "@/src/courses/domain/models/course-enrollment-model";
import { CourseEnrollmentModel } from "./course-enrollment-model";
import { CoursePermissionTypeModel } from "./course-permission-type-model";

export const CourseModelDataSchema = Schema.Struct({
  id: Schema.mutableKey(Schema.String),
  name: Schema.mutableKey(Schema.String),
  description: Schema.mutableKey(Schema.optional(Schema.NullOr(Schema.String))),
  picture: Schema.mutableKey(Schema.optional(Schema.NullOr(Schema.String))),
  isPublic: Schema.mutableKey(Schema.Boolean),
  permissionType: Schema.mutableKey(
    Schema.Union([Schema.Enum(CoursePermissionTypeModel), Schema.Null]),
  ),
  enrollment: Schema.mutableKey(
    Schema.Union([CourseEnrollmentModelDataSchema, Schema.Null]),
  ),
  tags: Schema.mutableKey(
    Schema.optional(Schema.NullOr(Schema.mutable(Schema.Array(Schema.String)))),
  ),
});
export type CourseModelData = typeof CourseModelDataSchema.Type;

/**
 * A course is a collection of notes. Users can enroll to a course to view its
 * notes and practice them via practice sessions.
 */
export class CourseModel extends Schema.Class<CourseModel>("CourseModel")({
  data: CourseModelDataSchema,
}) {
  constructor(data: CourseModelData) {
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

  get isPublic() {
    return this.data.isPublic;
  }

  get permissionType() {
    return this.data.permissionType;
  }

  get tags() {
    return this.data.tags ?? [];
  }

  get canView() {
    return (
      this.isPublic ||
      this.permissionType === CoursePermissionTypeModel.own ||
      this.permissionType === CoursePermissionTypeModel.edit ||
      this.permissionType === CoursePermissionTypeModel.view
    );
  }

  get canEdit() {
    return (
      this.permissionType === CoursePermissionTypeModel.own ||
      this.permissionType === CoursePermissionTypeModel.edit
    );
  }

  get canDelete() {
    return this.isOwner;
  }

  get isOwner() {
    return this.permissionType === CoursePermissionTypeModel.own;
  }

  get enrollment() {
    if (!this.data.enrollment) return null;
    return new CourseEnrollmentModel(this.data.enrollment);
  }

  get isEnrolled() {
    return Boolean(this.data.enrollment);
  }
}
