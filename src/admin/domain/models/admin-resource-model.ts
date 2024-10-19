import type { AdminResourceData } from "./admin-resource-data";

/**
 * The type of the resource of the admin panel. For example, `users` or
 * `courses`. Usually refers to the name of the collection in the database.
 */
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

/**
 * Describes a resource of the admin panel and its configuration. A resource is
 * a representation of a database collection in the admin panel. The
 * `AdminResourceModel` describes the fields of the resource, the type of the
 * fields, and how the user interacts with the resource in the admin panel.
 */
export interface AdminResourceModel {
  /**
   * Unique identifier of the resource. Matches the name of the collection in
   * the database.
   */
  resourceType: AdminResourceTypeModel;
  /**
   * Describes how the fields of the database collection are displayed in the
   * admin panel.
   */
  fields: AdminFieldModel[];
  /**
   * Forbid creating resources of this type
   */
  cannotCreate?: boolean;
  /**
   * Show a custom warning text in the "delete resource" dialog
   */
  showDeleteAlert?: boolean;
  /**
   * Show a warning when creating a new resource. Used to advise the user to
   * perform a certain action after creating the resource.
   */
  showCreationWarning?: boolean;
  /**
   * Lets you display fields from other collections in the admin panel.
   */
  joins?: AdminJoinModel[];
}

export interface AdminFieldModel {
  /**
   * Unique identifier of the field. Matches the name of the field in the
   * database collection.
   */
  name: string;
  /**
   * Type of the field. Determines how the field is displayed in the admin panel
   * and how it is stored in the database.
   */
  fieldType: AdminFieldTypeModel;
  /**
   * Sub-fields of the field. Used when the field type is `AdminFieldTypeModel.form`.
   */
  fields?: AdminFieldModel[];
  /**
   * Options for the field. Used when the field type is `AdminFieldTypeModel.select` or similar.
   */
  options?: string[];
  /**
   * Display options for the field. Lets you customize how the field is
   * displayed. For example, use a password field for a string field.
   */
  display?: AdminFieldDisplayModel;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  extraProps?: Record<string, any>;
  /**
   * Resource type of the ObjectId. Used when the field type is
   * `AdminFieldTypeModel.objectId`.
   */
  resourceType?: AdminResourceTypeModel;
  /**
   * Default value of the field when the resource is created.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  defaultValue?: any;
  /**
   * Do not show this field in the list or table view, but show it in the create
   * and detail view
   */
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

export interface AdminJoinModel {
  /**
   * Unique identifier of the join.
   */
  name: string;
  /**
   * Field to display from the foreign collection. Must be a string field.
   */
  displayField: string;
  /**
   * Local field to join on.
   */
  localField: string;
  /**
   * Foreign field to join on.
   */
  foreignField: string;
  /**
   * Resource type of the foreign collection.
   */
  resourceType: AdminResourceTypeModel;
}

/**
 * Gets the default values of a resource. Used to fill in the initial values of
 * the form that is displayed when creating a new resource.
 *
 * @param fields: Fields of the resource
 * @returns an object with the field names as keys and the default value of each
 * field
 */
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
        values[field.name] = null;
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

/**
 * After retrieving a document from the database, it strips away any fields
 * that are not defined in the admin resource configuration. It also serializes
 * de data of the document so that it can be safely transformed to a JSON object.
 * This serialization involves transforming ObjectId values into strings.
 *
 * @param fields The fields of the admin resource
 * @param data The data of the document that was retrieved from the database
 * @param joins The joins of the admin resource
 * @returns The transformed data
 */
export function transformDataAfterGet(
  fields: AdminFieldModel[],
  data: AdminResourceData,
  joins: AdminJoinModel[],
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
        [],
      );
    } else {
      newData[field.name] = data[field.name];
    }
  }
  for (const join of joins) {
    if (data[join.name]?._id) {
      newData[join.name] = {
        _id: data[join.name]._id.toString(),
        display: data[join.name].display,
      };
    }
  }
  return newData;
}
