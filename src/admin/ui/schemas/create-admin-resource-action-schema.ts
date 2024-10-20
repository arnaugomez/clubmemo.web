import { z } from "zod";
import { AdminResourceTypeSchema } from "./admin-resource-type-schema";

/**
 * Validates the parameters of `createAdminResourceAction`
 */
export const CreateAdminResourceActionSchema = z.object({
  resourceType: AdminResourceTypeSchema,
  data: z.record(z.any()),
});
