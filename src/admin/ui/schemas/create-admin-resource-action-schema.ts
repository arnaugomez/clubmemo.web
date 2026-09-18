import * as Schema from "effect/Schema";

import { AdminResourceTypeSchema } from "./admin-resource-type-schema";

/**
 * Validates the parameters of `createAdminResourceAction`
 */
export const CreateAdminResourceActionSchema = Schema.Struct({
  resourceType: AdminResourceTypeSchema,
  data: Schema.Record(Schema.String, Schema.Any),
});
