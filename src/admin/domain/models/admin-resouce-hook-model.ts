import type { Db, ObjectId } from "mongodb";
import type { AdminResourceData } from "./admin-resource-data";
import type { AdminResourceTypeModel } from "./admin-resource-model";

/**
 * Admin resource hooks let you perform special operations on certain
 * points of a resource lifecycle. For example, if you want to run a function
 * after a resource is delete it, you can do it with the `onDelete` hook.
 * This makes it possible to configure custom business logic that is necessary
 * for some resources to work.
 */
export interface AdminResourceHookModel {
  resourceType: AdminResourceTypeModel;
  /**
   * Function that runs before an admin resource is created. Can be used to
   * transform the resource data
   *
   * @param data The data of the resource that is about to be created
   * @param db The database connection
   * @returns The transformed resource data
   */
  beforeCreate?: (
    data: AdminResourceData,
    db: Db,
  ) => Promise<AdminResourceData>;
  /**
   * Function that runs before an admin resource is updated. Can be used to
   * transform the resource data
   *
   * @param data The resource data
   * @param db The database connection
   * @returns The transformed resource data
   */
  beforeUpdate?: (
    id: ObjectId,
    data: AdminResourceData,
    db: Db,
  ) => Promise<AdminResourceData>;
  /**
   * Function that runs after an admin resource is deleted. Can be used to clean
   * up associated resources.
   *
   * @param data The data of the resource that was removed from the database
   * @param db The database connection
   */
  afterDelete?: (
    id: ObjectId,
    data: AdminResourceData,
    db: Db,
  ) => Promise<void>;
}
