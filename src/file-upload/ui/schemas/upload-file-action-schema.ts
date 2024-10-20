import { z } from "zod";

/**
 * Validates the parameters of `uploadFileAction`
 */
export const UploadFileActionSchema = z.object({
  collection: z.enum(["profiles", "courses"]),
  field: z.enum(["picture", "backgroundPicture"]),
  contentType: z.string(),
});

/**
 * Parameters of `uploadFileAction`
 */
export type UploadFileActionModel = z.infer<typeof UploadFileActionSchema>;
