import { z } from "@/i18n/zod";
import { PasswordSchema } from "@/src/common/schemas/password-schema";
export const ChangePasswordActionSchema = z
  .object({
    password: z.string(),
    newPassword: PasswordSchema,
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
