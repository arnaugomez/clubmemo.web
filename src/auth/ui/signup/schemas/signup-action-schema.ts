import * as Schema from "effect/Schema";

import { AcceptTermsSchema } from "@/src/common/schemas/accept-terms-schema";
import { EmailSchema } from "@/src/common/schemas/email-schema";
import { PasswordSchema } from "@/src/common/schemas/password-schema";

/**
 * Validates the parameters of `signupAction`
 */
export const SignupActionSchema = Schema.Struct({
  email: EmailSchema,
  password: PasswordSchema,
  acceptTerms: AcceptTermsSchema,
});

/**
 * Parameters of `signupAction`
 */
export type SignupActionModel = (typeof SignupActionSchema)["Type"];
