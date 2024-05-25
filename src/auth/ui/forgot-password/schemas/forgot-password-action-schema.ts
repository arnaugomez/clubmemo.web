import { z } from "zod";

export const ForgotPasswordActionSchema = z.object({
  email: z.string().email(),
});

export type ForgotPasswordActionModel = z.infer<
  typeof ForgotPasswordActionSchema
>;
