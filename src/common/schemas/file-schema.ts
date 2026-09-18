import * as Schema from "effect/Schema";
import * as SchemaGetter from "effect/SchemaGetter";

export const FileSchema = Schema.instanceOf(File, {
  message: "No es un archivo válido",
});
export const FileFieldSchema = Schema.Union([Schema.String, FileSchema]);
export const OptionalFileFieldSchema = Schema.optional(
  Schema.NullOr(FileFieldSchema),
).pipe(
  Schema.decodeTo(
    Schema.optional(Schema.Union([Schema.String, Schema.instanceOf(File)])),
    {
      decode: SchemaGetter.transform((x) => x ?? undefined),
      encode: SchemaGetter.passthrough(),
    },
  ),
);
