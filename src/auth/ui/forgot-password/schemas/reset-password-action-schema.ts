import { z } from "@/i18n/zod";
import { EmailSchema } from "@/src/common/schemas/email-schema";
import { PasswordSchema } from "@/src/common/schemas/password-schema";

/**
 * Validates the parameters of `resetPasswordAction`
 */
export const ResetPasswordActionSchema = z.object({
  email: EmailSchema,
  token: z.string(),
  password: PasswordSchema,
});

/**
 * Parameters of `resetPasswordAction`
 */
export type ResetPasswordActionModel = z.infer<
  typeof ResetPasswordActionSchema
>;
