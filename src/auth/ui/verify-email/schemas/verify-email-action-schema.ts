import { z } from "@/i18n/zod";

/**
 * Validates the parameters of `verifyEmailAction`
 */
export const VerifyEmailActionSchema = z.object({
  code: z.string().length(6),
});

/**
 * Parameters of `verifyEmailAction`
 */
export type VerifyEmailActionModel = z.infer<typeof VerifyEmailActionSchema>;
