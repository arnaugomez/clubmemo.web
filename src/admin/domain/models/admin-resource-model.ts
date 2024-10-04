import type { AdminResourceData } from "./admin-resource-data";

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
  resourceType: AdminResourceTypeModel;
  fields: AdminFieldModel[];
  /**
   * Forbid creating resources of this type
   */
  cannotCreate?: boolean;
  showCreationWarning?: boolean;
}

export interface AdminFieldModel {
  name: string;
  isReadonly?: boolean;
  fieldType: AdminFieldTypeModel;
  /**
   * Sub-fields of the field. Used when the field type is `AdminFieldTypeModel.form`.
   */
  fields?: AdminFieldModel[];
  /**
   * Options for the field. Used when the field type is `AdminFieldTypeModel.select` or similar.
   */
  options?: string[];
  display?: AdminFieldDisplayModel;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  extraProps?: Record<string, any>;
  /**
   * Resource type of the ObjectId. Used when the field type is `AdminFieldTypeModel.objectId`.
   */
  resourceType?: AdminResourceTypeModel;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  defaultValue?: any;
  hideInList?: boolean;
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
  selectMultiple = "selectMultiple",
  file = "file",
}

export enum AdminFieldDisplayModel {
  textarea = "textarea",
  password = "password",
  slider = "slider",
}

export function getDefaultValuesOfAdminResource(fields: AdminFieldModel[]) {
  const values: Record<string, unknown> = {};
  for (const field of fields) {
    switch (field.fieldType) {
      case AdminFieldTypeModel.boolean:
        values[field.name] = false;
        break;
      case AdminFieldTypeModel.date:
        values[field.name] = null;
        break;
      case AdminFieldTypeModel.number:
        values[field.name] = 0;
        break;
      case AdminFieldTypeModel.string:
        values[field.name] = "";
        break;
      case AdminFieldTypeModel.tags:
        values[field.name] = [];
        break;
      case AdminFieldTypeModel.select:
        values[field.name] = null;
        break;
      case AdminFieldTypeModel.selectMultiple:
        values[field.name] = [];
        break;
      case AdminFieldTypeModel.form:
        values[field.name] = getDefaultValuesOfAdminResource(
          field.fields ?? [],
        );
        break;
      case AdminFieldTypeModel.richText:
        values[field.name] = "";
        break;
      case AdminFieldTypeModel.objectId:
        values[field.name] = "";
        break;
    }
    if (field.defaultValue !== undefined) {
      values[field.name] = field.defaultValue;
    }
  }
  return values;
}

export function transformDataAfterGet(
  fields: AdminFieldModel[],
  data: AdminResourceData,
): AdminResourceData {
  const newData: AdminResourceData = {};
  if (data._id) newData._id = data._id.toString();
  for (const field of fields) {
    if (field.fieldType === AdminFieldTypeModel.objectId) {
      newData[field.name] = data[field.name]?.toString();
    } else if (field.fieldType === AdminFieldTypeModel.form) {
      newData[field.name] = transformDataAfterGet(
        field.fields ?? [],
        data[field.name] ?? {},
      );
    } else {
      newData[field.name] = data[field.name];
    }
  }
  return newData;
}
