import { z } from "@/i18n/zod";

export const LoginWithPasswordActionSchema = z.object({
  email: z.string(),
  password: z.string(),
});

export type LoginWithPasswordActionModel = z.infer<
  typeof LoginWithPasswordActionSchema
>;
