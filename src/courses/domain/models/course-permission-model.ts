import type { CoursePermissionTypeModel } from "./course-permission-type-model";

export interface CoursePermissionModelData {
  id: string;
  courseId: string;
  profileId: string;
  permissionType: CoursePermissionTypeModel;
}

/**
 * A permission to view, edit, delete a course.
 * There are different types of permissions, defined in the `CoursePermissionTypeModel` enum.
 * @see CoursePermissionTypeModel
 */
export class CoursePermissionModel {
  constructor(private readonly data: CoursePermissionModelData) {}

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
