import { z } from "@/i18n/zod";

/**
 * Validates the parameters of `createCourseAction`
 */
export const CreateCourseActionSchema = z.object({
  name: z.string().trim().min(1).max(50),
});

/**
 * Parameters of `createCouseAction`
 */
export type CreateCourseActionModel = z.infer<typeof CreateCourseActionSchema>;
