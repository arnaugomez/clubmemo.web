import { z } from "@/i18n/zod";
import { EmailSchema } from "@/src/common/schemas/email-schema";

/**
 * Validates the parameters of `forgotPasswordAction`
 */
export const ForgotPasswordActionSchema = z.object({
  email: EmailSchema,
});

/**
 * Parameters of `forgotPasswordAction`
 */
export type ForgotPasswordActionModel = z.infer<
  typeof ForgotPasswordActionSchema
>;
