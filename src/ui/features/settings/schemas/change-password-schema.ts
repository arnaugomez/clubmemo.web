import { z } from "zod";

export const ChangePasswordSchema = z
  .object({
    password: z.string().min(8).max(256),
    repeatPassword: z.string(),
  })
  .superRefine(({ password, repeatPassword }, ctx) => {
    if (password !== repeatPassword) {
      ctx.addIssue({
        path: ["repeatNewPassword"],
        code: "custom",
        message: "The passwords do not match",
      });
    }
  });
