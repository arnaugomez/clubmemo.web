import * as Schema from "effect/Schema";

import { ObjectIdSchema } from "@/src/common/schemas/object-id-schema";
import { AdminResourceTypeSchema } from "./admin-resource-type-schema";

/**
 * Validates the parameters of `deleteAdminResourceAction`
 */
export const DeleteAdminResourceActionSchema = Schema.Struct({
  resourceType: AdminResourceTypeSchema,
  id: ObjectIdSchema,
});

/**
 * Validates the parameters of `deleteAdminResourceAction` when the resource type
 * is `AdminResourceTypeModel.sessions`
 */
export const DeleteAdminResourceActionSchemaForSessions = Schema.Struct({
  resourceType: AdminResourceTypeSchema,
  id: Schema.String,
});
