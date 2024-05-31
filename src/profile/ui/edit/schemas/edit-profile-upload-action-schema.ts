import { z } from "@/i18n/zod";

/**
 * Validates the parameters of `editProfileUploadAction`
 */
export const EditProfileUploadActionSchema = z.object({
  pictureContentType: z.string(),
  backgroundPictureContentType: z.string(),
  uploadPicture: z.boolean(),
  uploadBackgroundPicture: z.boolean(),
});

/**
 * Parameters of `editProfileUploadAction`
 */
export type EditProfileUploadActionModel = z.infer<
  typeof EditProfileUploadActionSchema
>;
