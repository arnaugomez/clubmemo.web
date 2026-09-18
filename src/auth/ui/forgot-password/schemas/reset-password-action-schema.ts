import * as Schema from "effect/Schema";

import { EmailSchema } from "@/src/common/schemas/email-schema";
import { PasswordSchema } from "@/src/common/schemas/password-schema";

/**
 * Validates the parameters of `resetPasswordAction`
 */
export const ResetPasswordActionSchema = Schema.Struct({
  email: EmailSchema,
  token: Schema.String,
  password: PasswordSchema,
});

/**
 * Parameters of `resetPasswordAction`
 */
export type ResetPasswordActionModel =
  (typeof ResetPasswordActionSchema)["Type"];
