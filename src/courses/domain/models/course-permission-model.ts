import type { CoursePermissionTypeModel } from "./course-permission-type-model";

interface CoursePermissionModelData {
  id: string;
  courseId: string;
  profileId: string;
  permissionType: CoursePermissionTypeModel;
}

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
