import { CoursePermissionTypeModel } from "./course-permission-type-model";

export interface CourseModelData {
  id: string;
  name: string;
  description?: string;
  picture?: string;
  isPublic: boolean;
  permissionType?: CoursePermissionTypeModel;
}

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

  get canView() {
    return (
      this.isPublic ||
      this.permissionType === CoursePermissionTypeModel.Own ||
      this.permissionType === CoursePermissionTypeModel.Edit ||
      this.permissionType === CoursePermissionTypeModel.View
    );
  }

  get canEdit() {
    return (
      this.permissionType === CoursePermissionTypeModel.Own ||
      this.permissionType === CoursePermissionTypeModel.Edit
    );
  }

  get canDelete() {
    return this.permissionType === CoursePermissionTypeModel.Own;
  }
}
