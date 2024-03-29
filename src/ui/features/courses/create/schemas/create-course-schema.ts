import { z } from "zod";

export const CreateCourseSchema = z.object({
  name: z.string().min(1),
});
