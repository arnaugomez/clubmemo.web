import type { Db, ObjectId } from "mongodb";
import type { AdminResourceData } from "./admin-resource-data";
import type { AdminResourceTypeModel } from "./admin-resource-model";

export interface AdminResourceHookModel {
  resourceType: AdminResourceTypeModel;
  beforeCreate?: (
    data: AdminResourceData,
    db: Db,
  ) => Promise<AdminResourceData>;
  beforeUpdate?: (
    id: ObjectId,
    data: AdminResourceData,
    db: Db,
  ) => Promise<AdminResourceData>;
  afterDelete?: (
    id: ObjectId,
    data: AdminResourceData,
    db: Db,
  ) => Promise<void>;
}
