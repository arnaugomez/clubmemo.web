import { z } from "zod";
import { AdminResourceTypeSchema } from "./admin-resource-type-schema";

export const CreateAdminResourceActionSchema = z.object({
  resourceType: AdminResourceTypeSchema,
  data: z.record(z.any()),
});
