import { z } from "@/i18n/zod";
import { EmailSchema } from "@/src/common/schemas/email-schema";

export const ForgotPasswordActionSchema = z.object({
  email: EmailSchema,
});

export type ForgotPasswordActionModel = z.infer<
  typeof ForgotPasswordActionSchema
>;
