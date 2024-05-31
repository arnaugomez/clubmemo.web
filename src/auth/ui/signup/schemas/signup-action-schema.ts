import { z } from "@/i18n/zod";
import { EmailSchema } from "@/src/common/schemas/email-schema";
import { PasswordSchema } from "@/src/common/schemas/password-schema";

/**
 * Validates the parameters of `signupAction`
 */
export const SignupActionSchema = z.object({
  email: EmailSchema,
  password: PasswordSchema,
});

/**
 * Parameters of `signupAction`
 */
export type SignupActionModel = z.infer<typeof SignupActionSchema>;
