import { ObjectIdSchema } from "@/src/common/schemas/object-id-schema";
import { z } from "zod";
import { AdminResourceTypeSchema } from "./admin-resource-type-schema";

/**
 * Validates the parameters of `deleteAdminResourceAction`
 */
export const DeleteAdminResourceActionSchema = z.object({
  resourceType: AdminResourceTypeSchema,
  id: ObjectIdSchema,
});

/**
 * Validates the parameters of `deleteAdminResourceAction` when the resource type
 * is `AdminResourceTypeModel.sessions`
 */
export const DeleteAdminResourceActionSchemaForSessions = z.object({
  resourceType: AdminResourceTypeSchema,
  id: z.string(),
});
