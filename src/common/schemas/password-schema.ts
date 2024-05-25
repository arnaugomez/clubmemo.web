import { z } from "../i18n/zod";

export const PasswordSchema = z
  .string()
  .min(8)
  .max(256)
  .refine((value) => /[a-z]/.test(value), {
    params: { i18n: "atLeastOneLowerCase" },
  })
  .refine((value) => /[A-Z]/.test(value), {
    params: { i18n: "atLeastOneUpperCase" },
  })
  .refine((value) => /[0-9]/.test(value), {
    params: { i18n: "atLeastOneNumber" },
  })
  .refine((value) => /[`!@#$%^&*()_\-+=\[\]{};':"\\|,.<>\/?~ ]/.test(value), {
    params: { i18n: "atLeastOneSpecialCharacter" },
  });
