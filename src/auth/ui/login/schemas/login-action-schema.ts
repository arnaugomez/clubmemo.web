import { z } from "zod";

export const LoginActionSchema = z.object({
  email: z.string(),
  password: z.string(),
});

export type LoginActionModel = z.infer<typeof LoginActionSchema>;
