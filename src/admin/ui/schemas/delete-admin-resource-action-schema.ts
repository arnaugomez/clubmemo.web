import { ObjectIdSchema } from "@/src/common/schemas/object-id-schema";
import { z } from "zod";
import { AdminResourceTypeSchema } from "./admin-resource-type-schema";

export const DeleteAdminResourceActionSchema = z.object({
  resourceType: AdminResourceTypeSchema,
  id: ObjectIdSchema,
});

export const DeleteAdminResourceActionSchemaForSessions = z.object({
  resourceType: AdminResourceTypeSchema,
  id: z.string(),
});
