import { z } from "zod";

export const SignupActionSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export type SignupActionModel = z.infer<typeof SignupActionSchema>;
