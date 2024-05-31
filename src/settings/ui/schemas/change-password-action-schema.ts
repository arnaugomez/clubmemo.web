import { z } from "@/i18n/zod";
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
        params: {
          i18n: "passwordsDoNotMatch",
        },
      });
    }
  });

/**
 * Parameters of `changePasswordAction`
 */
export type ChangePasswordActionModel = z.infer<
  typeof ChangePasswordActionSchema
>;
