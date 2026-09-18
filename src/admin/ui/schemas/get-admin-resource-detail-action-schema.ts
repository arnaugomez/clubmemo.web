import * as Schema from "effect/Schema";

import { ObjectIdSchema } from "@/src/common/schemas/object-id-schema";
import { AdminResourceTypeSchema } from "./admin-resource-type-schema";

/**
 * Validates the parameters of `getAdminResourceDetailAction`
 */
export const GetAdminResourceDetailActionSchema = Schema.Struct({
  resourceType: AdminResourceTypeSchema,
  id: ObjectIdSchema,
});
