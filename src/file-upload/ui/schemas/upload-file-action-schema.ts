import * as Schema from "effect/Schema";

/**
 * Validates the parameters of `uploadFileAction`
 */
export const UploadFileActionSchema = Schema.Struct({
  collection: Schema.Literals(["profiles", "courses"]),
  field: Schema.Literals(["picture", "backgroundPicture"]),
  contentType: Schema.String,
});

/**
 * Parameters of `uploadFileAction`
 */
export type UploadFileActionModel = (typeof UploadFileActionSchema)["Type"];
