import { z } from "@/i18n/zod";

export const EditProfileUploadActionSchema = z.object({
  pictureContentType: z.string(),
  backgroundPictureContentType: z.string(),
  uploadPicture: z.boolean(),
  uploadBackgroundPicture: z.boolean(),
});

export type EditProfileUploadActionModel = z.infer<
  typeof EditProfileUploadActionSchema
>;
