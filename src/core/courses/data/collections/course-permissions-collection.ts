import { collection } from "@/src/core/app/utils/mongo";
import { ObjectId, WithId } from "mongodb";
import { CoursePermissionModel } from "../../domain/models/course-permission-model";
import { CoursePermissionTypeModel } from "../../domain/models/course-permission-type-model";

export interface CoursePermissionDoc {
  courseId: ObjectId;
  profileId: ObjectId;
  permissionType: CoursePermissionTypeModel;
}
export const coursePermissionsCollection =
  collection<CoursePermissionDoc>("coursePermissions");

export class CoursePermissionDocTransformer {
  constructor(private readonly coursePermission: WithId<CoursePermissionDoc>) {}

  toDomain(): CoursePermissionModel {
    return new CoursePermissionModel({
      ...this.coursePermission,
      id: this.coursePermission._id.toString(),
      courseId: this.coursePermission.courseId.toString(),
      profileId: this.coursePermission.profileId.toString(),
    });
  }
}
