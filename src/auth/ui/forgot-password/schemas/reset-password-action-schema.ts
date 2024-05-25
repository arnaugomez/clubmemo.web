import { z } from "zod";

export const ResetPasswordActionSchema = z.object({
  email: z.string().email(),
  token: z.string(),
  password: z.string().min(8).max(256),
});

export type ResetPasswordActionModel = z.infer<
  typeof ResetPasswordActionSchema
>;
