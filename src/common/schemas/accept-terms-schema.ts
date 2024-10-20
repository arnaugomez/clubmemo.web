import { z } from "../i18n/zod";

/**
 * Validates the "Accept terms" field in the signup form.
 */
export const AcceptTermsSchema = z.boolean().refine((value) => value, {
  params: { i18n: "mustAcceptTerms" },
});
