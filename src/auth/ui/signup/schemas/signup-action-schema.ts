import { z } from "zod";

export const SignupActionSchema = z.object({
  email: z.string().email().max(254),
  password: z
    .string()
    .min(8)
    .max(256)
    .regex(/[A-Z]/)
    .regex(/[a-z]/)
    .regex(/[0-9]/)
    .regex(/[`!@#$%^&*()_\-+=\[\]{};':"\\|,.<>\/?~ ]/),
});

export type SignupActionModel = z.infer<typeof SignupActionSchema>;
