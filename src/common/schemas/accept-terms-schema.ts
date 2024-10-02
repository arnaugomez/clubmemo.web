import { z } from "../i18n/zod";

export const AcceptTermsSchema = z.boolean().refine((value) => value, {
  params: { i18n: "mustAcceptTerms" },
});
