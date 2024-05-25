import { z } from "../i18n/zod";

export const HandleSchema = z
  .string()
  .min(1)
  .max(15)
  .refine((value) => /^[a-zA-Z0-9_]+$/.test(value), {
    params: { i18n: "handleInvalidCharacters" },
  });
