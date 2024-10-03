import { z } from "zod";
/**
 * Validates the parameters of `uploadFileAction`
 */
export const UploadFileActionSchema = z.object({
  keyPrefix: z.string(),
  fileName: z.string(),
  contentType: z.string(),
});

/**
 * Parameters of `uploadFileAction`
 */
export type UploadFileActionModel = z.infer<typeof UploadFileActionSchema>;
