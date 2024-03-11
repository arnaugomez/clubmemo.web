import { FieldErrors } from "react-hook-form";
import { z } from "zod";

export const SignupFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export type SignupFormErrors = FieldErrors<z.infer<typeof SignupFormSchema>>;
