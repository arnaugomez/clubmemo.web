import type { OptionModel } from "@/src/common/domain/models/option-model";

export enum AdminResourceTypeModel {
  courseEnrollments = "courseEnrollments",
  coursePermissions = "coursePermissions",
  courses = "courses",
  emailVerificationCodes = "emailVerificationCodes",
  fileUploads = "fileUploads",
  forgotPasswordTokens = "forgotPasswordTokens",
  notes = "notes",
  practiceCards = "practiceCards",
  profiles = "profiles",
  rateLimits = "rateLimits",
  reviewLogs = "reviewLogs",
  sessions = "sessions",
  tags = "tags",
  users = "users",
}

export interface AdminResourceModel {
  type: AdminResourceTypeModel;
  fields: AdminFieldModel[];
}

interface AdminFieldModel {
  name: string;
  isReadonly?: boolean;
  type: AdminFieldTypeModel;
  /**
   * Sub-fields of the field. Used when the field type is `AdminFieldTypeModel.form`.
   */
  fields?: AdminFieldModel[];

  /**
   * Options for the field. Used when the field type is `AdminFieldTypeModel.select` or similar.
   */
  options?: OptionModel[];
}

export enum AdminFieldTypeModel {
  boolean = "boolean",
  date = "date",
  form = "form",
  number = "number",
  objectId = "objectId",
  string = "string",
  tags = "tags",
  richText = "richText",
  select = "select",
}
