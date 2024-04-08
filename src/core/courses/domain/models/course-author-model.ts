import { CoursePermissionTypeModel } from "./course-permission-type-model";

interface CourseAuthorModelData {
  courseId: string;
  permissionType: CoursePermissionTypeModel;

  profileId: string;
  displayName?: string;
  picture?: string;
  handle: string;
}

export class CourseAuthorModel {
  constructor(private readonly data: CourseAuthorModelData) {}
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
    return this.data.displayName;
  }
  get picture() {
    return this.data.picture;
  }
  get handle() {
    return this.data.handle;
  }
}
