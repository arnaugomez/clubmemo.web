import * as Schema from "effect/Schema";
export class ReactContextNotFoundError extends Schema.TaggedError<ReactContextNotFoundError>()(
  "ReactContextNotFoundError",
  {},
) {}
