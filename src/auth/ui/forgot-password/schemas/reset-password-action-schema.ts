import { z } from "@/i18n/zod";
import { EmailSchema } from "@/src/common/schemas/email-schema";

export const ResetPasswordActionSchema = z.object({
  email: EmailSchema,
  token: z.string(),
  password: z.string().min(8).max(256),
});

export type ResetPasswordActionModel = z.infer<
  typeof ResetPasswordActionSchema
>;
