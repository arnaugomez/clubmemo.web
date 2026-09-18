import * as Schema from "effect/Schema";
export class EnrollmentDoesNotExistError extends Schema.TaggedError<EnrollmentDoesNotExistError>()(
  "EnrollmentDoesNotExistError",
  {},
) {}
