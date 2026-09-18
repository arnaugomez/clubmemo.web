import * as Schema from "effect/Schema";
import * as SchemaGetter from "effect/SchemaGetter";

export const TagNameSchema = Schema.String.pipe(
  Schema.decode({
    decode: SchemaGetter.transform((value) => value.trim()),
    encode: SchemaGetter.passthrough(),
  }),
)
  .check(
    Schema.isMinLength(1, {
      message: `El texto debe contener al menos ${1} carácter(es)`,
    }),
  )
  .check(
    Schema.isMaxLength(50, {
      message: `El texto debe contener como máximo ${50} carácter(es)`,
    }),
  )
  .check(
    Schema.makeFilter((value) => /^[a-zA-Z0-9-_ ]+$/.test(value), {
      message:
        "Solo puede contener letras sin acento, números, guiones bajos y espacios",
    }),
  )
  .pipe(
    Schema.decode({
      decode: SchemaGetter.transform((value) => value.trim()),
      encode: SchemaGetter.passthrough(),
    }),
  );

export const TagsSchema = Schema.mutable(Schema.Array(TagNameSchema)).check(
  Schema.isMaxLength(10, {
    message: `La lista debe contener como máximo ${10} elemento(s)`,
  }),
);
