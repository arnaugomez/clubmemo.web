import * as Schema from "effect/Schema";
import * as SchemaGetter from "effect/SchemaGetter";

import { HandleSchema } from "@/src/common/schemas/handle-schema";
import { TagsSchema } from "@/src/tags/domain/schemas/tags-schema";

/**
 * Validates the parameters of `editProfileAction`
 */
export const EditProfileActionSchema = Schema.Struct({
  displayName: Schema.String.pipe(
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
  handle: HandleSchema,
  bio: Schema.String.pipe(
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
  website: Schema.Union([
    Schema.String.check(
      Schema.makeFilter(
        (value) => {
          try {
            new URL(value);
            return true;
          } catch {
            return false;
          }
        },
        { message: "Enlace inválido" },
      ),
    ).check(
      Schema.isMaxLength(2083, {
        message: `El texto debe contener como máximo ${2083} carácter(es)`,
      }),
    ),
    Schema.String.check(
      Schema.isMaxLength(0, {
        message: `El texto debe contener como máximo ${0} carácter(es)`,
      }),
    ),
  ]),
  isPublic: Schema.Boolean,
  picture: Schema.optional(Schema.String),
  backgroundPicture: Schema.optional(Schema.String),
  tags: TagsSchema,
});

/**
 * The parameters of `editProfileAction`
 */
export type EditProfileActionModel = (typeof EditProfileActionSchema)["Type"];
