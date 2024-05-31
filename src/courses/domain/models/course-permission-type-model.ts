export enum CoursePermissionTypeModel {
  /** Grants all permissions. The user can view, edit and delete the course */
  own = "own",
  /** Grants permission to edit, view, enroll and practice the course */
  edit = "edit",
  /** Grants permission to view the course, enroll to it and practice */
  view = "view",
}
