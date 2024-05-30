import { z } from "@/i18n/zod";
import { ObjectIdSchema } from "@/src/common/schemas/object-id-schema";

export const EditCourseActionSchema = z.object({
  id: ObjectIdSchema,
  name: z.string().trim().min(1).max(50),
  description: z.string().trim().min(0).max(255),
  isPublic: z.boolean(),
  picture: z.string().optional(),
  tags: z.array(z.string().trim().min(1).max(50)).max(10),
});

export type EditCourseActionModel = z.infer<typeof EditCourseActionSchema>;
