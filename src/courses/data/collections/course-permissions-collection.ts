import { collection } from "@/src/common/data/utils/mongo";
import type { ObjectId, WithId } from "mongodb";
import { CoursePermissionModel } from "../../domain/models/course-permission-model";
import type { CoursePermissionTypeModel } from "../../domain/models/course-permission-type-model";

export interface CoursePermissionDoc {
  courseId: ObjectId;
  profileId: ObjectId;
  permissionType: CoursePermissionTypeModel;
}

/**
 * Collection of MongoDB documents of type `CoursePermissionDoc`
 */
export const coursePermissionsCollection =
  collection<CoursePermissionDoc>("coursePermissions");

export class CoursePermissionDocTransformer {
  constructor(private readonly coursePermission: WithId<CoursePermissionDoc>) {}

  toDomain(): CoursePermissionModel {
    const { _id, ...rest } = this.coursePermission;
    return new CoursePermissionModel({
      ...rest,
      id: _id.toString(),
      courseId: this.coursePermission.courseId.toString(),
      profileId: this.coursePermission.profileId.toString(),
    });
  }
}
