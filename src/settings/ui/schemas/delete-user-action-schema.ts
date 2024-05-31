import { z } from "@/i18n/zod";

/**
 * Validates the parameters of `deleteUserAction`
 */
export const DeleteUserActionSchema = z.object({
  password: z.string(),
  confirmation: z.string(),
});

/**
 * Parameters of `deleteUserAction`
 */
export type DeleteUserActionModel = z.infer<typeof DeleteUserActionSchema>;
