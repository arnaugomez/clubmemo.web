import * as Schema from "effect/Schema";

import { EmailSchema } from "@/src/common/schemas/email-schema";
/**
 * Validates the parameters of `loginWithPasswordAction`
 */
export const LoginWithPasswordActionSchema = Schema.Struct({
  email: EmailSchema,
  password: Schema.String,
});

/**
 * Parameters of `loginWithPasswordAction`
 */
export type LoginWithPasswordActionModel =
  (typeof LoginWithPasswordActionSchema)["Type"];
