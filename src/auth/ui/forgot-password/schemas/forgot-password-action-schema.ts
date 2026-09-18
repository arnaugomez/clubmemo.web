import * as Schema from "effect/Schema";

import { EmailSchema } from "@/src/common/schemas/email-schema";

/**
 * Validates the parameters of `forgotPasswordAction`
 */
export const ForgotPasswordActionSchema = Schema.Struct({
  email: EmailSchema,
});

/**
 * Parameters of `forgotPasswordAction`
 */
export type ForgotPasswordActionModel =
  (typeof ForgotPasswordActionSchema)["Type"];
