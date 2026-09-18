import * as Schema from "effect/Schema";
import * as SchemaGetter from "effect/SchemaGetter";

/**
 * Validates the parameters of `createCourseAction`
 */
export const CreateCourseActionSchema = Schema.Struct({
  name: Schema.String.pipe(
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
    ),
});

/**
 * Parameters of `createCouseAction`
 */
export type CreateCourseActionModel = (typeof CreateCourseActionSchema)["Type"];
