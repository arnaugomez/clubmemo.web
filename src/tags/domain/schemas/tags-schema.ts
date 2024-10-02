import { z } from "zod";

export const TagNameSchema = z
  .string()
  .trim()
  .min(1)
  .max(50)
  .refine((value) => /^[a-zA-Z0-9-_ ]+$/.test(value), {
    params: { i18n: "tagInvalidCharacters" },
  })
  .transform((value) => value.trim());

export const TagsSchema = z.array(TagNameSchema).max(10);
