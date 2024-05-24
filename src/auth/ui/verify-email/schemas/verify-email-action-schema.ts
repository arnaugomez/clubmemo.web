import { z } from "zod";

export const VerifyEmailActionSchema = z.object({
  code: z.string().length(6),
});

export type VerifyEmailActionModel = z.infer<typeof VerifyEmailActionSchema>;
