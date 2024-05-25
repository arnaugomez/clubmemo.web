import { z } from "zod";

export const CreateCourseActionSchema = z.object({
  name: z.string().trim().min(1).max(50),
});

export type CreateCourseActionModel = z.infer<typeof CreateCourseActionSchema>;
