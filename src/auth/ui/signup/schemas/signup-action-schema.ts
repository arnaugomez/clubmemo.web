import { z } from "@/i18n/zod";
import { EmailSchema } from "@/src/common/schemas/email-schema";
import { PasswordSchema } from "@/src/common/schemas/password-schema";

export const SignupActionSchema = z.object({
  email: EmailSchema,
  password: PasswordSchema,
});

export type SignupActionModel = z.infer<typeof SignupActionSchema>;
