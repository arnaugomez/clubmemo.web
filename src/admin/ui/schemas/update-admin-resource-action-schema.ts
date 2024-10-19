import { ObjectIdSchema } from "@/src/common/schemas/object-id-schema";
import { z } from "zod";
import { AdminResourceTypeSchema } from "./admin-resource-type-schema";

/**
 * Validates the parameters of the `updateAdminResourceAction` server action.
 */
export const UpdateAdminResourceActionSchema = z.object({
  resourceType: AdminResourceTypeSchema,
  id: ObjectIdSchema,
  data: z.record(z.any()),
});
