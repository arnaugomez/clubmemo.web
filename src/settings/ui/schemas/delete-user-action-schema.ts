import { z } from "zod";

export const DeleteUserActionSchema = z.object({
  password: z.string(),
  confirmation: z.string(),
});

export type DeleteUserActionModel = z.infer<typeof DeleteUserActionSchema>;
