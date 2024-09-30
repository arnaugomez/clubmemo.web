import { z } from "@/i18n/zod";
import { HandleSchema } from "@/src/common/schemas/handle-schema";
import { TagsSchema } from "@/src/tags/domain/schemas/tags-schema";

/**
 * Validates the parameters of `editProfileAction`
 */
export const EditProfileActionSchema = z.object({
  displayName: z.string().trim().min(1).max(50),
  handle: HandleSchema,
  bio: z.string().trim().min(0).max(255),
  website: z.string().url().max(2083).or(z.string().max(0)),
  isPublic: z.boolean(),
  picture: z.string().optional(),
  backgroundPicture: z.string().optional(),
  tags: TagsSchema,
});

/**
 * The parameters of `editProfileAction`
 */
export type EditProfileActionModel = z.infer<typeof EditProfileActionSchema>;
