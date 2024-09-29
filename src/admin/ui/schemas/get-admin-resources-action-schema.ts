import { z } from "zod";
import { AdminResourceTypeSchema } from "./admin-resource-type-schema";

export const GetAdminResourcesActionSchema = z.object({
  resourceType: AdminResourceTypeSchema,
  page: z.number().int().positive().min(1),
  pageSize: z.number().int().positive().min(1).max(100),
});
