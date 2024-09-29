import { ObjectIdSchema } from "@/src/common/schemas/object-id-schema";
import { z } from "zod";
import { AdminResourceTypeSchema } from "./admin-resource-type-schema";

export const UpdateAdminResourceActionSchema = z.object({
  resourceType: AdminResourceTypeSchema,
  id: ObjectIdSchema,
  data: z.record(z.any()),
});
