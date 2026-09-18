import * as Schema from "effect/Schema";

import { ObjectIdSchema } from "@/src/common/schemas/object-id-schema";
import { AdminResourceTypeSchema } from "./admin-resource-type-schema";

/**
 * Validates the parameters of the `updateAdminResourceAction` server action.
 */
export const UpdateAdminResourceActionSchema = Schema.Struct({
  resourceType: AdminResourceTypeSchema,
  id: ObjectIdSchema,
  data: Schema.Record(Schema.String, Schema.Any),
});
