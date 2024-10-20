import { ObjectId } from "mongodb";
import type { AdminResourceData } from "../models/admin-resource-data";
import type { AdminFieldModel } from "../models/admin-resource-model";
import { AdminFieldTypeModel } from "../models/admin-resource-model";

/**
 * Transforms the data of a resource before creating or updating it. It applies
 * certain transformations so that the content is suitable for the database. For
 * example, instead of representing the id of a related resource as a string, it
 * is transformed into an ObjectId.
 *
 * @param fields The fields of the resource.
 * @param data The new data of the resource to be created or updated
 * @returns The data with the fields transformed.
 */
export function transformDataBeforeCreateOrUpdate(
  fields: AdminFieldModel[],
  data: AdminResourceData,
): AdminResourceData {
  for (const field of fields) {
    if (field.fieldType === AdminFieldTypeModel.objectId) {
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
