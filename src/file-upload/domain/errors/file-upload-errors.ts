import * as Schema from "effect/Schema";
export class FileUploadNotSuccessfulError extends Schema.TaggedError<FileUploadNotSuccessfulError>()(
  "FileUploadNotSuccessfulError",
  {},
) {}
