import { z } from "@/i18n/zod";

export const VerifyEmailActionSchema = z.object({
  code: z.string().length(6),
});

export type VerifyEmailActionModel = z.infer<typeof VerifyEmailActionSchema>;
