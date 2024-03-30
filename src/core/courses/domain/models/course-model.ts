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
    return this.isPublic || this.permissionType === "own";
  }

  get canEdit() {
    return this.permissionType === "own" || this.permissionType === "edit";
  }

  get canDelete() {
    return this.permissionType === "own";
  }

  get canLearn() {
    return (
      this.permissionType === "own" ||
      this.permissionType === "edit" ||
      this.permissionType === "learn"
    );
  }
}
