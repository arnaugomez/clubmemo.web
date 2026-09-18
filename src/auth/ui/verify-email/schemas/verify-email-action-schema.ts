import * as Schema from "effect/Schema";

/**
 * Validates the parameters of `verifyEmailAction`
 */
export const VerifyEmailActionSchema = Schema.Struct({
  code: Schema.String.check(
    Schema.isLengthBetween(6, 6, {
      message: `El texto debe contener exactamente ${6} carácter(es)`,
    }),
  ),
});

/**
 * Parameters of `verifyEmailAction`
 */
export type VerifyEmailActionModel = (typeof VerifyEmailActionSchema)["Type"];
