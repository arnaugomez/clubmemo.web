import type { CoursePermissionTypeModel } from "./course-permission-type-model";

export interface CourseAuthorModelData {
  courseId: string;
  permissionType: CoursePermissionTypeModel;

  profileId: string;
  displayName?: string;
  picture?: string;
  handle: string;
}

/**
 * An author of a course. The author is a profile that has permission to edit the
 * course or has created the course.
 */
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
