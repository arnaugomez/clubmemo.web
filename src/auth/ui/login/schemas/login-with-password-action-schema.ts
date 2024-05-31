import { z } from "@/i18n/zod";
import { EmailSchema } from "@/src/common/schemas/email-schema";
/**
 * Validates the parameters of `loginWithPasswordAction`
 */
export const LoginWithPasswordActionSchema = z.object({
  email: EmailSchema,
  password: z.string(),
});

/**
 * Parameters of `loginWithPasswordAction`
 */
export type LoginWithPasswordActionModel = z.infer<
  typeof LoginWithPasswordActionSchema
>;
