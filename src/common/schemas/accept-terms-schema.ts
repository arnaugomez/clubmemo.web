import * as Schema from "effect/Schema";

/**
 * Validates the "Accept terms" field in the signup form.
 */
export const AcceptTermsSchema = Schema.Boolean.check(
  Schema.makeFilter((value) => value, {
    message: "Debe aceptar los términos y condiciones",
  }),
);
