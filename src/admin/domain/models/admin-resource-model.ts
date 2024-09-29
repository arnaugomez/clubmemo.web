import { ObjectId } from "mongodb";
import { z } from "zod";
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
}

interface AdminFieldModel {
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

export function createValidationSchemaOfAdminResource(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _adminResource: AdminResourceModel,
) {
  return z.any();
}

export function transformDataBeforeCreateOrUpdate(
  fields: AdminFieldModel[],
  data: AdminResourceData,
): AdminResourceData {
  for (const field of fields) {
    if (field.isReadonly) {
      delete data[field.name];
    } else if (field.fieldType === AdminFieldTypeModel.objectId) {
      const value = data[field.name];
      if (typeof value === "string" && ObjectId.isValid(value)) {
        data[field.name] = new ObjectId(value);
      } else {
        data[field.name] = null;
      }
    } else if (field.fieldType === AdminFieldTypeModel.form) {
      data[field.name] = transformDataBeforeCreateOrUpdate(
        field.fields ?? [],
        data[field.name] ?? {},
      );
    }
  }
  return data;
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
