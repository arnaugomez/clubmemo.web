import { z } from "@/i18n/zod";
import { ObjectIdSchema } from "@/src/common/schemas/object-id-schema";
import { TagsSchema } from "@/src/tags/domain/schemas/tags-schema";

/**
 * Validates the parameters of `editCourseAction`
 */
export const EditCourseActionSchema = z.object({
  id: ObjectIdSchema,
  name: z.string().trim().min(1).max(50),
  description: z.string().trim().min(0).max(255),
  isPublic: z.boolean(),
  picture: z.string().optional(),
  tags: TagsSchema,
});

/**
 * Parameters of `editCourseAction`
 */
export type EditCourseActionModel = z.infer<typeof EditCourseActionSchema>;
