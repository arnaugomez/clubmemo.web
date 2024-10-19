import { ObjectIdSchema } from "@/src/common/schemas/object-id-schema";
import { z } from "zod";
import { AdminResourceTypeSchema } from "./admin-resource-type-schema";

/**
 * Validates the parameters of `getAdminResourceDetailAction`
 */
export const GetAdminResourceDetailActionSchema = z.object({
  resourceType: AdminResourceTypeSchema,
  id: ObjectIdSchema,
});
