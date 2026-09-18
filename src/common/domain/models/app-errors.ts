import * as Schema from "effect/Schema";
export class NoPermissionError extends Schema.TaggedError<NoPermissionError>()(
  "NoPermissionError",
  {},
) {}
export class InvalidFileFormatError extends Schema.TaggedError<InvalidFileFormatError>()(
  "InvalidFileFormatError",
  {},
) {}

export class NullError extends Schema.TaggedError<NullError>()("NullError", {
  message: Schema.String,
}) {
  constructor(name: string) {
    super({ message: `${name} is null` });
  }
}
