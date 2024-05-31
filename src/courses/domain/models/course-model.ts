import type { CourseEnrollmentModelData } from "./course-enrollment-model";
import { CourseEnrollmentModel } from "./course-enrollment-model";
import { CoursePermissionTypeModel } from "./course-permission-type-model";

export interface CourseModelData {
  id: string;
  name: string;
  description?: string;
  picture?: string;
  isPublic: boolean;
  permissionType: CoursePermissionTypeModel | null;
  enrollment: CourseEnrollmentModelData | null;
  tags?: string[];
}

/**
 * A course is a collection of notes. Users can enroll to a course to view its
 * notes and practice them via practice sessions.
 */
export class CourseModel {
  constructor(readonly data: CourseModelData) {}

  get id() {
    return this.data.id;
  }

  get name() {
    return this.data.name;
  }

  get description() {
    return this.data.description;
  }

  get picture() {
    return this.data.picture;
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
