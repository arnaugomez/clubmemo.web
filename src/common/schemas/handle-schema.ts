import * as Schema from "effect/Schema";

export const HandleSchema = Schema.String.check(
  Schema.isMinLength(1, {
    message: `El texto debe contener al menos ${1} carácter(es)`,
  }),
)
  .check(
    Schema.isMaxLength(32, {
      message: `El texto debe contener como máximo ${32} carácter(es)`,
    }),
  )
  .check(
    Schema.makeFilter((value) => /^[a-zA-Z0-9_]+$/.test(value), {
      message: "Solo puede contener letras, números y guiones bajos",
    }),
  );
