import * as Schema from "effect/Schema";

export class ExternalServiceError extends Schema.TaggedError<ExternalServiceError>()(
  "ExternalServiceError",
  { operation: Schema.String, cause: Schema.Defect() },
) {}

export class FieldValidationError extends Schema.TaggedError<FieldValidationError>()(
  "FieldValidationError",
  { path: Schema.String, message: Schema.String },
) {}
