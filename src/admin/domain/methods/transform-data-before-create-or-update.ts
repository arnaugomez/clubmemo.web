import { ObjectId } from "mongodb";
import type { AdminResourceData } from "../models/admin-resource-data";
import type { AdminFieldModel } from "../models/admin-resource-model";
import { AdminFieldTypeModel } from "../models/admin-resource-model";

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
