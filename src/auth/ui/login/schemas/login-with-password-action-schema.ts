import { z } from "@/i18n/zod";
import { EmailSchema } from "@/src/common/schemas/email-schema";

export const LoginWithPasswordActionSchema = z.object({
  email: EmailSchema,
  password: z.string(),
});

export type LoginWithPasswordActionModel = z.infer<
  typeof LoginWithPasswordActionSchema
>;
