import { z } from "@/i18n/zod";
import { EmailSchema } from "@/src/common/schemas/email-schema";
import { PasswordSchema } from "@/src/common/schemas/password-schema";

export const ResetPasswordActionSchema = z.object({
  email: EmailSchema,
  token: z.string(),
  password: PasswordSchema,
});

export type ResetPasswordActionModel = z.infer<
  typeof ResetPasswordActionSchema
>;
