import { z } from "zod";
export const ChangePasswordActionSchema = z
  .object({
    password: z.string(),
    newPassword: z.string().min(8).max(256),
    repeatNewPassword: z.string(),
  })
  .superRefine(({ newPassword, repeatNewPassword }, ctx) => {
    if (newPassword !== repeatNewPassword) {
      ctx.addIssue({
        path: ["repeatNewPassword"],
        code: "custom",
        message: "The passwords do not match",
      });
    }
  });

export type ChangePasswordActionModel = z.infer<
  typeof ChangePasswordActionSchema
>;
