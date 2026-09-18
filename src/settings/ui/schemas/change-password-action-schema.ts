import * as Schema from "effect/Schema";

import { PasswordSchema } from "@/src/common/schemas/password-schema";
export const ChangePasswordActionSchema = Schema.Struct({
  password: Schema.String,
  newPassword: PasswordSchema,
  repeatNewPassword: Schema.String,
}).check(
  Schema.makeFilter(({ newPassword, repeatNewPassword }) =>
    newPassword === repeatNewPassword
      ? undefined
      : { path: ["repeatNewPassword"], issue: "The passwords do not match" },
  ),
);

/**
 * Parameters of `changePasswordAction`
 */
export type ChangePasswordActionModel =
  (typeof ChangePasswordActionSchema)["Type"];
