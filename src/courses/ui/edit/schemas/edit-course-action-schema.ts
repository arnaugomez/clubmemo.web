import * as Schema from "effect/Schema";
import * as SchemaGetter from "effect/SchemaGetter";

import { ObjectIdSchema } from "@/src/common/schemas/object-id-schema";
import { TagsSchema } from "@/src/tags/domain/schemas/tags-schema";

/**
 * Validates the parameters of `editCourseAction`
 */
export const EditCourseActionSchema = Schema.Struct({
  id: ObjectIdSchema,
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
  description: Schema.String.pipe(
    Schema.decode({
      decode: SchemaGetter.transform((value) => value.trim()),
      encode: SchemaGetter.passthrough(),
    }),
  )
    .check(
      Schema.isMinLength(0, {
        message: `El texto debe contener al menos ${0} carácter(es)`,
      }),
    )
    .check(
      Schema.isMaxLength(255, {
        message: `El texto debe contener como máximo ${255} carácter(es)`,
      }),
    ),
  isPublic: Schema.Boolean,
  picture: Schema.optional(Schema.String),
  tags: TagsSchema,
});

/**
 * Parameters of `editCourseAction`
 */
export type EditCourseActionModel = (typeof EditCourseActionSchema)["Type"];
