import { z } from "zod";

export const EditProfileActionSchema = z.object({
  displayName: z.string().trim().min(1).max(50),
  handle: z
    .string()
    .min(1)
    .max(15)
    .regex(/^[a-zA-Z0-9_]+$/),
  bio: z.string().trim().min(0).max(255),
  website: z.string().url().max(2083).or(z.string().max(0)),
  isPublic: z.boolean(),
  picture: z.string().optional(),
  backgroundPicture: z.string().optional(),
  tags: z.array(z.string().trim().min(1).max(50)).max(10),
});

export type EditProfileActionModel = z.infer<typeof EditProfileActionSchema>;
